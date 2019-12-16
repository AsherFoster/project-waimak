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
                      v-model="moduleName"
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
          <WithTooltip value="Delete Module">
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
      <WithTooltip value="Module Settings (WIP)">
        <v-btn icon>
          <v-icon>settings</v-icon>
        </v-btn>
      </WithTooltip>
    </v-toolbar>
    <AceEditor
            :value="module ? module.body : ''"
            @input="bodyChange"
            :disabled="saving || $apollo.loading || !module"
    ></AceEditor>
    <v-banner :value="bodyDirty" single-line class="unsaved-banner">
      You have unsaved changes
      <template v-slot:actions>
        <v-btn :disabled="saving" @click="() => saveScript()">Save</v-btn>
      </template>
    </v-banner>
  </v-layout>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import gql from 'graphql-tag';
  import {debounce} from '@/util';
  import SelectBotForDeployment from '@/components/SelectBotForDeployment.vue';
  import AceEditor from '@/components/AceEditor.vue';
  import WithTooltip from '@/components/WithTooltip.vue';

  interface Module {
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
  module(id: $id) {
    id
    name
    body
  }
}`,
          variables: {
            id: this.$route.params.id
          },
          result(res: {data: {script: Module}}) {
            this.scriptName = res.data.script.name;
          }
        };
      }
    }
  })
  export default class ScriptDetail extends Vue {
    public module: Module | null = null;
    public bodyDirty: boolean = false; // If the code has been modified, and should be savable
    public saving: boolean = false;
    public savingName: boolean = false;
    public moduleName: string = '';
    public nameError: string = '';

    public debouncedTitleChange = debounce(() => this.saveTitle(), 500);
    @Watch('scriptName')
    public onScriptNameChange() {
      this.debouncedTitleChange();
    }

    public async saveTitle() {
      // Don't save if not loaded, if it's invalid, or it hasn't changed
      if (!this.module || this.module.name === this.moduleName) return this.nameError = '';
      if (!this.moduleName) return this.nameError = 'Name is required';
      // this.nameError = '';
      this.savingName = true;
      let newScript;
      let error = '';
      try {
        newScript = await this.$apollo.mutate({
          mutation: gql`mutation UpdateModuleName($module: ModuleUpdateInput!) {
    updateModule(module: $module) {
      id
      name
    }
  }`,
          variables: {
            module: {
              name: this.moduleName,
              id: (this.module as Module).id
            }
          }
        }) as any;
      } catch (e) {
        if (e.message.includes('name already exists')) error = 'A module with that name already exists';
        else if (e.message.includes('Invalid module name')) error = 'Name must be alphanumeric with dashes';
        else error = 'Internal Error occurred';
      }
      if (newScript) {
        this.module.name = newScript.data.updateScript.name;
        this.moduleName = this.module.name; // Just in case the server modifies it
      }
      this.nameError = error;
      this.savingName = false;
    }
    public deployToBot(id: string) {
      if (!this.module) return;
      this.$apollo.mutate({
        mutation: gql`mutation LinkModuleToBot($module: String!, $bot: String!) {
    linkModuleToBot(module: $module, bot: $bot) {
      bot {
        id
      }
    }
  }`,
        variables: {
          module: this.module.id,
          bot: id
        }
      });
    }
    public async saveScript(): Promise<void> {
      if (!this.module) return;
      this.saving = true;
      await this.$apollo.mutate({
        mutation: gql`mutation UpdateScript($module: ModuleUpdateInput!) {
updateModule(module: $module) {
  id
  body
}
}`,
        variables: {
          script: {
            id: (this.module as Module).id,
            body: (this.module as Module).body // Cast it, if it's saving, it must exist
          }
        }
      });

      this.bodyDirty = false;
      this.saving = false;
    }
    public async deleteScript(): Promise<void> {
      await this.$apollo.mutate({
        mutation: gql`mutation DeleteModule($id: String!) {
  deleteModule(id: $id)
}`,
        variables: {
          id: (this.module as Module).id
        },
        refetchQueries: ['ListScripts']
      });

      this.$router.push('/workspace/' + this.$route.params.workspace);
    }
    public bodyChange(val: string) {
      // Editor is disabled if script doesn't exist, so this will never be true
      if (!this.module) return;
      // If it's actually modified, i.e hasn't just been set
      if (val !== this.module.body) {
        this.module.body = val;
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
