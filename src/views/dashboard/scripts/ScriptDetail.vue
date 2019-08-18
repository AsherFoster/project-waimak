<template>
  <v-layout column fill-height>
    <v-toolbar>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-hover>
        <template slot-scope="{ hover }">
          <v-text-field
                  solo
                  :flat="!hover"
                  hide-details
                  v-model="scriptName"
                  class="toolbar-title-input title ml-5"
          ></v-text-field>
        </template>
      </v-hover>
      <v-flex></v-flex>
      <v-btn icon>
        <v-icon>delete</v-icon>
      </v-btn>
      <v-btn icon>
        <v-icon>settings</v-icon>
      </v-btn>
      <v-btn icon @click="selectingBotForDeploy = true">
        <v-icon>cloud_upload</v-icon>
      </v-btn>
    </v-toolbar>
    <AceEditor
            :value="script ? script.body : ''"
            @input="bodyChange"
            :disabled="saving || $apollo.loading || !script"
    ></AceEditor>
    <v-banner :value="bodyDirty" single-line class="unsaved-banner">
      You have unsaved changes
      <template v-slot:actions>
        <v-btn :disabled="saving" @click="saveAndRestart" text>Save and restart</v-btn>
        <v-btn :disabled="saving" @click="saveScript">Save</v-btn>
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

  interface Script {
    id: string;
    name: string;
    body: string;
  }

  @Component({
    components: {SelectBotForDeployment, AceEditor},
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
    public scriptName: string = '';

    public debouncedTitleChange = debounce(async (name: string) => {
      // Don't save if not loaded, if it's invalid, or it hasn't changed
      if (!this.script || !(this.script as Script).name || this.script.name === name) return;

      const newScript = await this.$apollo.mutate({
        mutation: gql`mutation UpdateScriptName($script: ScriptUpdateInput!) {
  updateScript(script: $script) {
    id
    name
  }
}`,
        variables: {
          script: {
            name,
            id: (this.script as Script).id
          }
        }
      }) as any;
      this.script.name = newScript.data.updateScript.name;
      this.scriptName = this.script.name; // Just in case the server modifies it
    }, 400);
    public deployToBot(id: string) {
      this.$apollo.mutate({
        mutation: gql`mutation DeployScriptToBot($script: String!, $bot: String!) {
  addScriptToBot(script: $script, bot: $bot)
}`,
        variables: {
          script: this.script,
          bot: id
        }
      });
    }
    public async saveAndRestart(): Promise<void> {
      // TODO implement restart
      await this.saveScript();
    }
    public async saveScript(): Promise<void> {
      this.saving = true;
      await this.$apollo.mutate({
        mutation: gql`mutation UpdateScript($script: ScriptUpdateInput!) {
  updateScript(script: $script) {
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
        }
      });
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

    @Watch('scriptName')
    public titleChange() {
      this.debouncedTitleChange(this.scriptName);
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
