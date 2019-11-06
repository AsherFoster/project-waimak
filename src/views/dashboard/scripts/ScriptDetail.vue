<template>
  <v-layout column fill-height>
    <v-toolbar>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-flex shrink>
        <v-hover>
          <template slot-scope="{ hover }">
            <v-layout>
              <v-text-field
                      :readonly="savingName"
                      v-model="scriptName"
                      hide-details
                      solo
                      :flat="!hover"
                      :error="!!nameError"
                      class="toolbar-title-input title"
              ></v-text-field>
              <WithTooltip v-if="nameError" :value="nameError" :css="'display: flex; align-content: center'">
                <v-icon class="red--text">error</v-icon>
              </WithTooltip>
              <v-icon v-else-if="savingName" style="opacity: 0.3">sync</v-icon>
              <v-icon v-else-if="hover" style="opacity: 0.3">check_circle</v-icon>
            </v-layout>
          </template>
        </v-hover>
      </v-flex>
      <v-flex></v-flex>
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <WithTooltip value="Delete Script">
            <v-btn icon v-on="on">
              <v-icon>delete</v-icon>
            </v-btn>
          </WithTooltip>
        </template>
        <v-card>
          <v-list>
            <v-list-item @click="">
              <v-list-item-icon>
                <v-icon>cancel</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Cancel</v-list-item-title>
            </v-list-item>
            <v-list-item @click="deleteScript">
              <v-list-item-icon>
                <v-icon>delete</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Confirm</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
      <WithTooltip value="Script Settings (WIP)">
        <v-btn icon>
          <v-icon>settings</v-icon>
        </v-btn>
      </WithTooltip>
      <WithTooltip value="Deploy to Bot">
        <v-btn icon @click="selectingBotForDeploy = true">
          <v-icon>play_arrow</v-icon>
        </v-btn>
      </WithTooltip>
    </v-toolbar>
    <AceEditor
            :value="script ? script.body : ''"
            @input="bodyChange"
            :disabled="saving || $apollo.loading || !script"
    ></AceEditor>
    <v-banner :value="bodyDirty" single-line class="unsaved-banner">
      You have unsaved changes
      <template v-slot:actions>
        <v-btn :disabled="saving" @click="() => saveScript(true)" text>Save and restart</v-btn>
        <v-btn :disabled="saving" @click="() => saveScript()">Save</v-btn>
      </template>
    </v-banner>
    <SelectBotForDeployment
            v-if="script"
            v-model="selectingBotForDeploy"
            :script="script && script.id"
            @selected="deployToBot"
    ></SelectBotForDeployment>
  </v-layout>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import gql from 'graphql-tag';
  import {debounce} from '@/util';
  import SelectBotForDeployment from '@/components/SelectBotForDeployment.vue';
  import AceEditor from '@/components/AceEditor.vue';
  import WithTooltip from '@/components/WithTooltip.vue';

  interface Script {
    id: string;
    name: string;
    body: string;
  }

  @Component({
    components: {WithTooltip, SelectBotForDeployment, AceEditor},
    apollo: {
      script() {
        return {
          query: gql`query GetScriptDetails($id: String!) {
  script(id: $id) {
    id
    name
    body
  }
}`,
          variables: {
            id: this.$route.params.id
          },
          result(res: {data: {script: Script}}) {
            this.scriptName = res.data.script.name;
          }
        };
      }
    }
  })
  export default class ScriptDetail extends Vue {
    public script: Script | null = null;
    public selectingBotForDeploy: boolean = false; // If selection dialog is open
    public bodyDirty: boolean = false; // If the code has been modified, and should be savable
    public saving: boolean = false;
    public savingName: boolean = false;
    public scriptName: string = '';
    public nameError: string = '';

    public debouncedTitleChange = debounce(() => this.saveTitle(), 500);
    @Watch('scriptName')
    public onScriptNameChange() {
      this.debouncedTitleChange();
    }

    public async saveTitle() {
      // Don't save if not loaded, if it's invalid, or it hasn't changed
      if (!this.script || this.script.name === this.scriptName) return this.nameError = '';
      if (!this.scriptName) return this.nameError = 'Name is required';
      // this.nameError = '';
      this.savingName = true;
      let newScript;
      let error = '';
      try {
        newScript = await this.$apollo.mutate({
          mutation: gql`mutation UpdateScriptName($script: ScriptUpdateInput!) {
    updateScript(script: $script) {
      id
      name
    }
  }`,
          variables: {
            script: {
              name: this.scriptName,
              id: (this.script as Script).id
            }
          }
        }) as any;
      } catch (e) {
        if (e.message.includes('name already exists')) error = 'A script with that name already exists';
        else if (e.message.includes('Invalid script name')) error = 'Name must be alphanumeric with dashes';
        else error = 'Internal Error occurred';
      }
      if (newScript) {
        this.script.name = newScript.data.updateScript.name;
        this.scriptName = this.script.name; // Just in case the server modifies it
      }
      this.nameError = error;
      this.savingName = false;
    }
    public deployToBot(id: string, isNew: boolean) {
      if (!this.script) return;

      if (isNew) {
        this.$apollo.mutate({
          mutation: gql`mutation DeployScriptToBot($script: String!, $bot: String!) {
    addScriptToBot(script: $script, bot: $bot) {
      bot {
        id
      }
    }
  }`,
          variables: {
            script: this.script.id,
            bot: id
          }
        });
      } else {
        this.$apollo.mutate({
          mutation: gql`mutation RestartScriptOnBot($script: String!, $bot: String!) {
    restartScriptOnBot(script: $script, bot: $bot) {
      bot {
        id
      }
    }
  }`,
          variables: {
            script: this.script.id,
            bot: id
          }
        });
      }
    }
    public async saveScript(restart: boolean = false): Promise<void> {
      if (!this.script) return;
      this.saving = true;
      await this.$apollo.mutate({
        mutation: gql`mutation UpdateScript($script: ScriptUpdateInput!) {
updateScript(script: $script) {
  id
  body
}
}`,
        variables: {
          script: {
            id: (this.script as Script).id,
            body: (this.script as Script).body // Cast it, if it's saving, it must exist
          }
        }
      });

      if (restart) {
        await this.$apollo.mutate({
          mutation: gql`mutation RestartScriptEverywhere($script: String!) {
    restartScriptEverywhere(script: $script) {
      bot {
        id
      }
    }
  }`,
          variables: {
            script: this.script.id
          }
        });
      }
      this.bodyDirty = false;
      this.saving = false;
    }
    public async deleteScript(): Promise<void> {
      await this.$apollo.mutate({
        mutation: gql`mutation DeleteScript($script: String!) {
  deleteScript(script: $script)
}`,
        variables: {
          script: (this.script as Script).id
        },
        refetchQueries: ['ListScripts']
      });

      this.$router.push('/scripts');
    }
    public bodyChange(val: string) {
      // Editor is disabled if script doesn't exist, so this will never be true
      if (!this.script) return;
      // If it's actually modified, i.e hasn't just been set
      if (val !== this.script.body) {
        this.script.body = val;
        this.bodyDirty = true;
      }
    }
  }
</script>

<style scoped>
  .unsaved-banner {
    position: absolute;
    z-index: 5;
    bottom: 0;
    right: 0;
    width: 100%;
  }
  .toolbar-title-input {
    padding-top: 0;
    font-weight: 400;
  }
</style>
