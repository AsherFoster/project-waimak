<template>
  <v-container>
    <v-layout wrap>
      <v-flex md4 v-for="bot in bots" :key="bot.id" pa-3>
        <v-card class="bot-card">
          <router-link :to="'/dashboard/bots/' + bot.id">
            <v-card-title>
              <v-avatar>
                <img :src="bot.avatarUrl">
              </v-avatar>
              <span class="title ml-2">{{bot.name}}</span>
            </v-card-title>
          </router-link>
          <v-card-text>
            <v-layout>
              <v-flex xs4>
                <p class="headline mb-0">{{bot.runningScriptCount}}</p>
                <p>running scripts</p>
              </v-flex>
              <v-divider class="mx-3" vertical />
              <v-flex xs4 v-if="bot.connection">
                <p class="headline mb-0">{{bot.connection.created | momentnow(true)}}</p>
                <p>uptime</p>
              </v-flex>
              <v-flex xs4 v-else>
                <p class="headline mb-0">Offline</p>
              </v-flex>
            </v-layout>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-tooltip bottom>
              <v-btn color="error" icon flat slot="activator">
                <v-icon>warning</v-icon>
              </v-btn>
              <span>Panic -- Stop all scripts</span>
            </v-tooltip>
            <v-btn icon>
              <v-icon>more_vert</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
      <v-flex md4 pa-3>
        <v-layout align-center justify-center column class="bot-card">
          <v-btn icon fab to="/dashboard/bots/create" color="accent">
            <v-icon>add</v-icon>
          </v-btn>
        </v-layout>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {Getter} from 'vuex-class';
  import gql from 'graphql-tag';

  interface Bot {
    id: string;
    name: string;
    avatarUrl: string | null;
    runningScriptCount: number;
    connection: {
      created: Date
    } | null;
  }

  @Component({
    apollo: {
      bots: gql`query ListAllBots {
  bots {
    id
    name
    avatarUrl
    runningScriptCount
    connection {
      created
    }
  }
}`
    }
  })
  export default class BotIndex extends Vue {
    @Getter('avatarUrl', {namespace: 'auth'}) public avatarUrl!: string;
    public bots: Bot[] = [];
  }
</script>

<style scoped>
  .bot-card {
    min-height: 200px;
  }
</style>
