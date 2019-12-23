<template>
  <v-dialog :value="value" @input="input" max-width="600">
    <v-card>
      <v-card-title>🌈 s e t t i n g s 🌈</v-card-title>
      <v-card-text v-if="workspace">
        <DebouncedInput :value="workspaceName" :save-fn="saveName" :error.sync="nameError">
          <v-text-field
                  :readonly="savingName"
                  v-model="workspaceName"
                  :error-messages="nameError"
                  label="Name"
          />
        </DebouncedInput>
        <v-divider />
        <v-subheader class="pl-0">Permissions <v-chip small>WIP</v-chip></v-subheader>
        <v-list>
          <v-list-item>
            You (owner)
          </v-list-item>
        </v-list>
        <v-divider />
        <v-subheader class="pl-0">Danger Zone</v-subheader>
        <v-layout align-center>
          <v-dialog max-width="400">
            <template #activator="{ on }">
              <v-btn v-on="on" :disabled="workspace.isPersonal">Delete Workspace</v-btn>
            </template>
            <v-card>
              <v-card-title>Confirm Delete</v-card-title>
              <v-card-text>
                <p>Please type <b>{{workspace.name}}</b> to confirm</p>
                <v-text-field v-model="deleteConfirmValue" />
              </v-card-text>
              <v-card-actions>
                <v-flex />
                <v-btn text @click="deleteConfirmOpen = false">Cancel</v-btn>
                <v-btn color="error" :disabled="deleteConfirmValue !== workspace.name" @click="doDelete" :loading="deleting">Delete</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <p class="caption mb-0 ml-4" v-if="workspace.isPersonal">You can't delete your personal workspace</p>
        </v-layout>
      </v-card-text>
      <v-layout v-else justify-center pa-4>
        <v-progress-circular indeterminate />
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
  import gql from 'graphql-tag';
  import DebouncedInput from '@/components/DebouncedInput.vue';

  interface Workspace {
    id: string;
    name: string;
    isPersonal: boolean;
    resourceOwner: {
      id: string;
    }
  }

  @Component({
    components: {DebouncedInput},
    apollo: {
      workspace: {
        query: gql`query GetWorkspaceForSettings($id: String!) {
  workspace(id: $id) {
    id
    name
    isPersonal
    resourceOwner {
      id
    }
  }
}`,
        variables() {
          return {
            id: this.workspaceId
          };
        },
        result(res) {
          this.workspaceName = res.data.workspace.name;
        }
      }
    }
  })
  export default class WorkspaceSettings extends Vue {
    @Prop({default: false})
    public value!: boolean;
    @Prop({required: true})
    public workspaceId!: string;

    public workspace: Workspace | null = null;
    public deleteConfirmValue: string = '';
    public deleting: boolean = false;

    public workspaceName: string = '';
    public savingName: boolean = false;
    public nameError: string = '';

    @Emit()
    public input(val: boolean) {
      return val;
    }

    public async saveName() {
      if (!this.workspace || this.workspaceName === this.workspace.name) return;
      if (!this.workspaceName) throw new Error('Name must not be blank');
      this.savingName = true;
      await this.$apollo.mutate({
        mutation: gql`mutation UpdateWorkspaceName ($workspace: UpdateWorkspaceInput!) {
  updateWorkspace(workspace: $workspace) {
    id
    name
  }
}`,
        variables: {
          workspace: {
            id: this.workspace.id,
            name: this.workspaceName
          }
        }
      }).finally(() => {
        this.savingName = false;
      });
    }
    public async doDelete() {
      if (!this.workspace) return;
      this.deleting = true;
      await this.$apollo.mutate({
        mutation: gql`mutation DeleteWorkspace($id: String!) {
  removeWorkspace(id: $id)
}`,
        variables: {
          id: this.workspace.id
        },
        refetchQueries: [{
          query: gql`query UpdateCacheAfterDeleteWorkspace {
  workspaces {
    nodes {
      id
      name
    }
  }
}`
        }]
      });
      this.input(false);
      this.$router.push('/workspaces');
    }
  }
</script>

<style scoped>

</style>
