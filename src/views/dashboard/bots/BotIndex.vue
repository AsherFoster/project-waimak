<template>
  <v-container class="fill-height">
    <v-layout v-if="!$apollo.loading && bots.nodes.length" wrap>
      <v-flex xs12 sm6 md4 v-for="bot in bots.nodes" :key="bot.id" pa-3>
        <v-card class="bot-card">
          <router-link :to="'/bots/' + bot.id" class="hidden-link">
            <v-card-title>
              <v-avatar>
                <img :src="bot.avatarUrl">
              </v-avatar>
              <span class="title ml-2">{{bot.name}}</span>
              <StatusIcon :connection="bot.connection"></StatusIcon>
            </v-card-title>
          </router-link>
          <v-card-text>
            <v-layout>
              <v-flex md6>
                <router-link :to="`/bots/${bot.id}/scripts`" class="hidden-link">
                    <p class="headline mb-0">{{bot.scripts.totalCount}}</p>
                    <p>linked scripts</p>
                </router-link>
              </v-flex>
              <v-divider class="mx-3" vertical />
              <v-flex md6 v-if="bot.connection">
                <p class="headline mb-0">{{bot.connection.created | cMomentNow(true)}}</p>
                <p>uptime</p>
              </v-flex>
              <v-flex md6 v-else>
                <p class="headline mb-0">Offline</p>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
<!--            Is the panic button really useful? -->
<!--            <v-tooltip bottom>-->
<!--              <v-btn color="error" icon flat slot="activator" @click="botPanic(bot)">-->
<!--                <v-icon>warning</v-icon>-->
<!--              </v-btn>-->
<!--              <span>Panic &#45;&#45; Stop all scripts</span>-->
<!--            </v-tooltip>-->
<!--            <v-btn icon>-->
<!--              <v-icon>more_vert</v-icon>-->
<!--            </v-btn>-->
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex md4 pa-3>
        <v-layout align-center justify-center column class="bot-card">
          <v-btn fab to="/bots/link" color="accent">
            <v-icon>add</v-icon>
          </v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
    <v-layout v-else-if="!$apollo.loading" align-center fill-height justify-center column>
      <h1>No bots found</h1>
      <p>Let's change that!</p>
      <v-btn to="/bots/link" color="accent" large>
        Link a bot
      </v-btn>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {Getter} from 'vuex-class';
  import gql from 'graphql-tag';
  import StatusIcon from '@/components/StatusIcon.vue';

  interface Bot {
    id: string;
    name: string;
    avatarUrl: string | null;
    scripts: {totalCount: number};
    connection: {
      created: Date
    } | null;
  }
  interface BotQuery {
    nodes: Bot[];
  }

  @Component({
    components: {StatusIcon},
    apollo: {
      bots: gql`query ListBots {
  bots {
    nodes {
      id
      name
      avatarUrl
      scripts {
        totalCount
      }
      connection {
        created
        state
      }
    }
  }
}`
    }
  })
  export default class BotIndex extends Vue {
    @Getter('avatarUrl', {namespace: 'auth'}) public avatarUrl!: string;
    public bots: BotQuery | null = null;
  }
</script>

<style scoped>
  .bot-card {
    min-height: 200px;
  }
  .hidden-link {
    color: inherit;
    text-decoration: none;
  }
</style>
