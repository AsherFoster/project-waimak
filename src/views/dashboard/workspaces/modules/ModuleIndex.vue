<template>
  <div>
    <v-toolbar align-center>
      <v-select
              v-if="workspaces"
              solo
              flat
              hide-details
              :items="workspaces.nodes"
              item-value="id"
              item-text="name"
              :value="workspace ? workspace.id : ''"
              @input="workspaceSelectChange"
              class="workspace-select"
      >
        <template v-slot:item="{ item }">
          <h2 class="title">{{item.name}}</h2>
        </template>
        <template v-slot:selection="{ item }">
          <h2 class="title title-cut-text">{{item.name}}</h2>
        </template>
      </v-select>
      <h2 class="headline my-2" v-else>Loading...</h2>
      <v-flex />
      <v-btn icon @click="reloadList">
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-btn icon @click="workspaceSettingsOpen = true">
        <v-icon>settings</v-icon>
      </v-btn>
      <v-progress-linear absolute bottom indeterminate :active="$apollo.loading" />
    </v-toolbar>
    <v-list v-if="workspace && workspace.modules.nodes.length">
<!--      We need to use @click rather than :to here in order to support stopPropagation on the action (I think) -->
      <v-list-item v-for="module in workspace.modules.nodes" two-line @click="$router.push('./modules/' + module.id)" :key="module.id">
        <v-list-item-content>
          <v-list-item-title>
            {{module.name}}
          </v-list-item-title>
          <v-list-item-subtitle>
            Last edited {{module.updated || module.created | cMomentNow}}
          </v-list-item-subtitle>
        </v-list-item-content>
        <v-list-item-action>
          <v-menu>
            <template v-slot:activator="{ on }">
              <v-btn icon @click.stop="(e) => on.click(e)">
                <v-icon>delete</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-list>
                <v-list-item @click="">
                  <v-list-item-action>
                    <v-icon>cancel</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>
                    Cancel
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="deleteModule(module)">
                  <v-list-item-action>
                    <v-icon>delete_forever</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>
                    Delete Permanently
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </v-list-item-action>
      </v-list-item>
    </v-list>
    <v-layout class="ma-4" v-else-if="workspace && !workspace.modules.nodes.length" align-center column>
      <h2 class="headline">No modules found</h2>
      <v-btn @click="createModule" text>Create one</v-btn>
    </v-layout>
    <v-layout class="ma-4" v-else-if="!workspace && !$apollo.loading" justify-center>
      <h2 class="headline">Workspace not found</h2>
    </v-layout>
    <v-tooltip left>
      <template #activator="{ on }">
        <v-btn fab @click="createModule" fixed bottom right color="accent" v-on="on">
          <v-icon>add</v-icon>
        </v-btn>
      </template>
      <span>Create Module</span>
    </v-tooltip>
    <WorkspaceSettings v-model="workspaceSettingsOpen" :workspace-id="workspace.id" v-if="workspace" />
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import gql from 'graphql-tag';
  import WorkspaceSettings from '@/components/WorkspaceSettings.vue';

  interface Module {
    id: string;
    name: string;
    created: Date;
    updated: Date;
  }
  interface Workspace {
    id: string;
    name: string;
    modules: {
      totalCount: number;
      nodes: Module[];
    };
  }

  interface Workspaces {
    nodes: {
      id: string;
      name: string;
    };
  }

  @Component({
    components: {WorkspaceSettings},
    apollo: {
      workspace: {
        query: gql`query GetModulesInWorkspace($workspace: String!) {
  workspace(id: $workspace) {
    id
    name
    modules {
      totalCount
      nodes {
        id
        name
        created
        updated
      }
    }
  }
}`,
        variables() {
          return {
            workspace: this.$route.params.workspace
          };
        }
      },
      workspaces: gql`query ListWorkspacesForSelect {
  workspaces {
    nodes {
      id
      name
    }
  }
}`
    }
  })
  export default class ModuleIndex extends Vue {
    public workspace: Workspace | null = null;
    public workspaces: Workspaces | null = null;
    public workspaceSettingsOpen: boolean = false;
    public workspaceSelectChange(v: string) {
      this.$router.push({params: {workspace: v}});
    }

    public async createModule() {
      if (!this.workspace) return;
      const resp = await this.$apollo.mutate({
        mutation: gql`mutation CreateModuleInWorkspace($module: ModuleCreateInput!) {
  createModule(module: $module) {
    id
  }
}`,
        variables: {
          module: {
            runtime: 'JAVASCRIPT',
            workspace: this.workspace.id
          }
        },
        refetchQueries: [{
          query: gql`query UpdateCacheWithNewModule($id: String!) {
  workspace(id: $id) {
    id
    modules {
      nodes {
        id
        name
      }
    }
  }
}`,
          variables: {
            id: this.workspace.id
          }
        }]
      });

      this.$router.push('./modules/' + resp.data.createModule.id);
    }
    public async deleteModule(module: Module) {
      await this.$apollo.mutate({
        mutation: gql`mutation DeleteModule($id: String!) {
  deleteModule(id: $id)
}`,
        variables: {
          id: module.id
        },
        refetchQueries: ['GetModulesInWorkspace']
      });
    }
    public reloadList() {
      this.$apollo.queries.workspace.refetch();
    }
  }
</script>

<style scoped>
  .workspace-select {
    max-width: 400px;
  }
  .workspace-select >>> .v-select__selections {
    /* Maybe hacky, but the -28px is to offset for the dropdown icon*/
    max-width: calc(100% - 28px);
    padding-top: 0 !important;
    flex-wrap: nowrap;
  }
</style>
