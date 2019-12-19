<template>
  <div v-if="workspaces && workspaces.nodes">
    <v-layout row ma-2>
      <h2 class="headline">Workspaces</h2>
      <v-flex />
      <v-btn text>
        Create New
        <v-icon right>add</v-icon>
      </v-btn>
    </v-layout>
    <v-divider />
    <v-layout mt-4>
      <v-flex xs12 sm6 md3 v-for="workspace in workspaces.nodes" :key="workspace.id">
        <v-card :to="'/workspaces/' + workspace.id">
          <v-card-title>
            {{workspace.name}}
          </v-card-title>
          <v-card-subtitle>
            {{workspace.modules.totalCount}} modules
          </v-card-subtitle>
        </v-card>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import gql from 'graphql-tag';

  interface Workspace {
    id: string;
    name: string;
    modules: {
      totalCount: number;
    };
  }
  interface WorkspaceQueryResult {
    nodes: Workspace[];
  }

  @Component({
    apollo: {
      workspaces: gql`query ListWorkspaces {
  workspaces {
    nodes {
      id
      name
      modules {
        totalCount
      }
    }
  }
}`
    }
  })
  export default class WorkspaceIndex extends Vue {
    public workspaces: WorkspaceQueryResult | null = null;
  }
</script>

<style scoped>

</style>
