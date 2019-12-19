<template>
  <v-layout column fill-height>
    <v-toolbar>
      <v-btn icon @click="$router.go(-1)">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-flex shrink>
        <v-hover>
          <template slot-scope="{ hover }">
            <DebouncedInput :save-fn="saveTitle" :error.sync="nameError" :value="moduleName" :show-error="true">
              <v-text-field
                      :readonly="savingName"
                      v-model="moduleName"
                      hide-details
                      solo
                      :flat="!hover"
                      :error="!!nameError"
                      class="toolbar-title-input title"
              />
            </DebouncedInput>
          </template>
        </v-hover>
      </v-flex>
      <v-flex />
      <v-btn icon @click="deploying = true">
        <v-icon>link</v-icon>
      </v-btn>
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
<!--      <WithTooltip value="Module Settings (WIP)">-->
<!--        <v-btn icon>-->
<!--          <v-icon>settings</v-icon>-->
<!--        </v-btn>-->
<!--      </WithTooltip>-->
    </v-toolbar>
    <AceEditor
            :value="module ? module.body : ''"
            @input="bodyChange"
            :disabled="saving || $apollo.loading || !module"
    />
    <v-banner :value="bodyDirty" single-line class="unsaved-banner">
      You have unsaved changes
      <template v-slot:actions>
        <v-btn :disabled="saving" @click="() => saveScript()">Save</v-btn>
      </template>
    </v-banner>
    <SelectBotToLinkTo v-if="module" v-model="deploying" :module="module.id" />
  </v-layout>
</template>

<script lang="ts">
  import {Component, Vue, Watch} from 'vue-property-decorator';
  import gql from 'graphql-tag';
  import {debounce} from '@/util';
  import AceEditor from '@/components/AceEditor.vue';
  import WithTooltip from '@/components/WithTooltip.vue';
  import SelectBotToLinkTo from '@/components/SelectBotToLinkTo.vue';
  import DebouncedInput from '@/components/DebouncedInput.vue';

  interface Module {
    id: string;
    name: string;
    body: string;
  }

  @Component({
    components: {DebouncedInput, SelectBotToLinkTo, WithTooltip, AceEditor},
    apollo: {
      module(this: ModuleDetail) {
        return {
          query: gql`query GetModuleDetails($id: String!) {
  module(id: $id) {
    id
    name
    body
  }
}`,
          variables: {
            id: this.$route.params.id
          },
          result: (res: {data: {module: Module}}) => {
            this.moduleName = res.data.module.name;
          }
        };
      }
    }
  })
  export default class ModuleDetail extends Vue {
    public module: Module | null = null;
    public bodyDirty: boolean = false; // If the code has been modified, and should be savable
    public saving: boolean = false;
    public savingName: boolean = false;
    public moduleName: string = '';
    public nameError: string = '';
    public deploying: boolean = false;

    public async saveTitle() {
      // Don't save if not loaded, if it's invalid, or it hasn't changed
      if (!this.module || this.module.name === this.moduleName) return;
      if (!this.moduleName) throw new Error('Name is required');
      this.savingName = true;
      let newScript;
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
        if (e.message.includes('name already exists')) throw new Error('A module with that name already exists');
        if (e.message.includes('Invalid module name')) throw new Error('Name must be alphanumeric with dashes');
        throw new Error('An unknown occurred');
      }
      if (newScript) {
        this.module.name = newScript.data.updateModule.name;
        this.moduleName = this.module.name; // Just in case the server modifies it
      }
      this.savingName = false;
    }

    public async saveScript(): Promise<void> {
      if (!this.module) return;
      this.saving = true;
      await this.$apollo.mutate({
        mutation: gql`mutation UpdateModule($module: ModuleUpdateInput!) {
updateModule(module: $module) {
  id
  body
}
}`,
        variables: {
          module: {
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
        refetchQueries: ['ListModules']
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
