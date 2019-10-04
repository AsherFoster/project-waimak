<template>
  <div class="fill-height pa-6">
    <v-banner icon="bug_report" class="home-banner mb-4" elevation="4">
      Hey there! This app is still in beta, and some features may not work as expected. Just as an FYI, most of the data
      on this homepage is fudged!
      <template v-slot:actions="{dismiss}">
        <v-btn text @click="dismiss">Dismiss</v-btn>
      </template>
    </v-banner>
    <v-layout row wrap v-if="bots && bots.nodes.length">
      <v-flex xs12 md6 pa-2 v-for="bot in bots.nodes" :key="bot.id">
        <v-card>
          <router-link :to="'/bots/' + bot.id">
            <v-card-title primary-title>
              <v-avatar size="38" class="avatar" slot="activator">
                <img :src="bot.avatarUrl">
              </v-avatar>
              <span class="title ml-2">{{bot.name}}</span>
              <StatusIcon :connection="bot.connection"></StatusIcon>
            </v-card-title>
          </router-link>
          <v-layout>
            <v-flex xs8 ma-4>
              <div>
                <v-sparkline
                        :value="sparkline"
                        color="#9c27b0"
                        :line-width="3"
                        :smooth="5"
                        auto-draw
                ></v-sparkline>
              </div>
            </v-flex>
            <v-flex xs4 ma-4 style="text-align: right">
              <v-layout wrap>
                <v-flex sm6>
                  <p class="display-2">{{bot.scripts.totalCount}}</p>
                  <p class="caption">Scripts running</p>
                </v-flex>
                <v-flex sm6>
                  <p class="display-2">32</p>
                  <p class="caption">Guilds</p>
                </v-flex>
              </v-layout>
            </v-flex>
          </v-layout>
        </v-card>
      </v-flex>
    </v-layout>
    <v-layout v-else-if="bots && bots.nodes" align-center class="my-6" column>
      <p>You don't have any bots yet!</p>
      <v-btn to="/bots/link">Make one!</v-btn>
    </v-layout>
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
    scripts: {
      totalCount: number;
    };
    connection: {
      state: string;
    } | null;
  }
  interface BotsQueryResult {
    bots: {
        nodes: Bot[];
    };
  }
  @Component({
    components: {
      StatusIcon
    },
    apollo: {
      bots: gql`query GetOverviewOfAllBots {
  bots {
    nodes {
      id
      name
      avatarUrl
      scripts {
        totalCount
      }
      connection {
        state
      }
    }
  }
}`
    }
  })
  export default class Home extends Vue {
    public bots: BotsQueryResult | null = null;

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
