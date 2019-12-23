<template>
  <v-dialog :value="value" @input="input" max-width="600">
    <v-card>
      <v-card-title>Select a module to attach...</v-card-title>
      <v-list v-if="workspaces">
        <v-list-group v-for="(workspace, i) in workspaces.nodes" :key="workspace.id" :value="i === 0">
          <template #activator>
            <v-list-item-title>
              {{workspace.name}}
              <span class="caption">({{workspace.modules.totalCount}})</span>
            </v-list-item-title>
          </template>
          <v-list-item v-for="module in workspace.modules.nodes" :key="module.name" @click="select(module)" :disabled="!!module.link">
            <v-list-item-icon>
              <v-icon>description</v-icon>
            </v-list-item-icon>
            <v-list-item-content>
              <v-list-item-title>{{module.name}}</v-list-item-title>
              <v-list-item-subtitle v-if="module.link">This script is already linked</v-list-item-subtitle>
            </v-list-item-content>
          </v-list-item>
          <v-subheader v-if="!workspace.modules.nodes.length">No modules in this workspace</v-subheader>
        </v-list-group>
      </v-list>
      <v-layout v-else ma-4 align-center>
        <v-progress-circular indeterminate />
      </v-layout>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
  import gql from 'graphql-tag';

  interface Module {
    id: string;
    name: string;
    link?: {
      created: Date;
    };
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
    nodes: Workspace[];
  }

  @Component({
    apollo: {
      workspaces: {
        query: gql`query GetWorkspaces ($bot: String!) {
  workspaces {
    nodes {
      id
      name
      modules {
        totalCount
        nodes {
          id
          name
          link(bot: $bot) {
            created
          }
        }
      }
    }
  }
}`,
        variables() {
          return {
            bot: this.bot
          };
        }
      }
    }
  })
  export default class SelectModuleToAttach extends Vue {
    @Prop({default: false})
    public value!: boolean;
    @Prop({required: true})
    public bot!: string;

    public workspaces: Workspaces | null = null;

    @Emit()
    public input(val: boolean) {
      return val;
    }

    public async select(module: Module) {
      await this.$apollo.mutate({
        mutation: gql`mutation AttachModuleToBot ($module: String!, $bot: String!) {
  linkModuleToBot(module: $module, bot: $bot) {
    created
  }
}`,
        variables: {
          module: module.id,
          bot: this.bot
        },
        refetchQueries: [{
          query: gql`query UpdateCacheWithNewModuleLink ($bot: String!) {
  bot(id: $bot) {
    id
    modules {
      nodes {
        module {
          id
          name
        }
      }
    }
  }
}`,
          variables: {
            bot: this.bot
          }
        }]
      });
      this.input(false);
    }
  }
</script>

<style scoped>

</style>
