<template>
  <div class="fill-height pa-6">
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
    <div>
      <v-layout row ma-2 mt-6>
        <h2 class="headline">Bots</h2>
        <v-flex />
        <v-btn text to="/bots/link">
          Create New
          <v-icon right>add</v-icon>
        </v-btn>
      </v-layout>
      <v-divider />
      <v-layout row wrap v-if="bots && bots.nodes.length">
        <v-flex v-for="bot in bots.nodes" :key="bot.id" class="ma-4" style="max-width: 230px">
          <v-card :to="'/bots/' + bot.id">
            <v-img aspect-ratio="1" :src="bot.avatarUrl" />
            <v-card-title>
              {{bot.name}}
            </v-card-title>
            <v-card-subtitle>
              {{bot.modules.totalCount}} modules
            </v-card-subtitle>
          </v-card>
        </v-flex>
      </v-layout>
      <div v-else-if="bots && bots.nodes" class="my-6 mx-2">
        <p>You don't have any bots yet!</p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import {namespace} from 'vuex-class';
  import gql from 'graphql-tag';
  import StatusIcon from '@/components/StatusIcon.vue';

  const auth = namespace('auth');

  interface Bot {
    id: string;
    name: string;
    avatarUrl: string;
    modules: {
      totalCount: number;
    };
  }
  interface Workspace {
    id: string;
    name: string;
    modules: {
      totalCount: number;
    };
  }
  interface BotQueryResult {
    nodes: Bot[];
  }
  interface WorkspaceQueryResult {
    nodes: Workspace[];
  }

  @Component({
    components: {
      StatusIcon
    },
    apollo: {
      bots: gql`query GetBotsForDashboard {
  bots {
    nodes {
      id
      name
      avatarUrl
      modules {
        totalCount
      }
    }
  }
}`,
      workspaces: gql`query GetWorkspacesForDashboard {
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
  export default class Home extends Vue {
    public bots: BotQueryResult | null = null;
    public workspaces: WorkspaceQueryResult | null = null;

    public sparkline = Array.from({length: 24}, this.sparklineValue);

    public sparklineValue() {
      return Math.floor(Math.random() * 10);
    }
  }
</script>
<style scoped>
  .home-banner >>> .v-banner__wrapper {
    border-bottom: none;
  }
</style>
