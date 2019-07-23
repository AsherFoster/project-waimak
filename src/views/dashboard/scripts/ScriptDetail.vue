<template>
  <div v-if="script">
    <v-toolbar>
      <v-btn icon to="/dashboard/scripts">
        <v-icon>arrow_back</v-icon>
      </v-btn>
      <v-layout @mouseenter="editTitle(true)" @mouseleave="editTitle(false)" align-center>
        <v-text-field
                v-if="editingTitle"
                hide-details
                v-model="script.name"
                class="toolbar-title-input title"
        ></v-text-field>
        <v-toolbar-title v-else class="toolbar-title-text">{{script.name}}</v-toolbar-title>
      </v-layout>
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
    <div>
      <v-textarea
              :disabled="saving"
              v-model="script.body"
              @input="bodyDirty = true"
      ></v-textarea>
      <v-slide-y-reverse-transition>
        <v-toolbar v-if="bodyDirty" class="save-popup">
          <v-flex></v-flex>
          <v-btn :disabled="saving" @click="saveAndRestart" flat>Save and restart</v-btn>
          <v-btn :disabled="saving" @click="saveScript">Save</v-btn>
        </v-toolbar>
      </v-slide-y-reverse-transition>
    </div>
    <SelectBotForDeployment
            v-model="selectingBotForDeploy"
            :script="script.id"
            @selected="deployToBot"
    ></SelectBotForDeployment>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import gql from 'graphql-tag';
  import SelectBotForDeployment from '@/components/SelectBotForDeployment.vue';

  function debounce(func: (...args: any[]) => any, wait: number) {
    let timeout: number;
    return (...args: any[]) => {
      if (timeout) clearTimeout(timeout);
      timeout = setTimeout(func, wait, args) as unknown as number; // ...sigh
    };
  }

  interface Script {
    id: string;
    name: string;
    body: string;
  }

  @Component({
    components: {SelectBotForDeployment},
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
          }
        };
      }
    }
  })
  export default class Detail extends Vue {
    public script: Script | null = null;
    public selectingBotForDeploy: boolean = false; // If selection dialog is open
    public bodyDirty: boolean = false; // If the code has been modified, and should be savable
    public saving: boolean = false;
    public editingTitle: boolean = false;

    public editTitle(val: boolean) {
      this.editingTitle = val;
    }
    public deployToBot(id: string) {
      // STUB
      this.$apollo.mutate({
        mutation: gql`mutation DeployScriptToBot($script: String!, $bot: String!) {
  runScriptOnBot(script: $script, bot: $bot)
}`,
        variables: {
          script: this.script,
          bot: id
        }
      });
    }
    public async saveAndRestart(): Promise<void> {

      await this.saveScript();
    }
    public async saveScript(): Promise<void> {
      this.saving = true;
      await this.$apollo.mutate({
        mutation: gql`mutation UpdateScript($script: ScriptInput!) {
  updateScript(script: $script) {
    body
  }
}`,
        variables: {
          script: {
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
  }
</script>

<style scoped>
  .save-popup {
    position: absolute;
    left: 0;
    bottom: 0;
  }
  .toolbar-title-text {
    letter-spacing: unset;
  }
  .toolbar-title-input {
    max-width: 200px;
    padding-top: 0;
  }
</style>
