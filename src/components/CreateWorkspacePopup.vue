<template>
  <v-dialog :value="value" @input="input" max-width="400">
    <v-text-field
            v-model="name"
            label="Enter new workspace name"
            solo
            hide-details
            append-icon="navigate_next"
            :loading="loading"
            @keypress.enter="save"
            @click:append="save"
    />
  </v-dialog>
</template>

<script lang="ts">
  import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
  import gql from 'graphql-tag';

  @Component({})
  export default class CreateWorkspacePopup extends Vue {
    @Prop({default: false})
    public value!: boolean;
    public name: string = '';
    public loading: boolean = false;

    @Emit()
    public input(val: boolean) {
      return val;
    }

    public async save() {
      if (!this.name || this.loading) return;
      this.loading = true;
      const resp = await this.$apollo.mutate({
        mutation: gql`mutation CreateNewWorkspace($workspace: CreateWorkspaceInput!) {
  createWorkspace(workspace: $workspace) {
    id
    name
  }
}`,
        variables: {
          workspace: {
            name: this.name
          }
        },
        refetchQueries: [{
          query: gql`query UpdateCacheWithNewWorkspace {
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
      this.$router.push('/workspaces/' + resp.data.createWorkspace.id);
    }
  }
</script>

<style scoped>

</style>
