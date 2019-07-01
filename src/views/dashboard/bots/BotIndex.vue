<template>
  <v-container>
    <v-layout wrap>
      <v-flex md4 v-for="bot in bots" pa-3>
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
                <p class="headline mb-0">8</p>
                <p>running scripts</p>
              </v-flex>
              <v-divider class="mx-3" vertical />
              <v-flex xs4>
                <p class="headline mb-0">5 hours</p>
                <p>uptime</p>
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
          <v-btn icon fab to="/bots/create" color="accent">
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

  interface Bot {
    id: string;
    name: string;
    platform: string;
    scriptsRunning: number;
    avatarUrl: string;
  }

  @Component({})
  export default class BotIndex extends Vue {
    @Getter('avatarUrl', {namespace: 'auth'}) public avatarUrl!: string;
    public bots: Bot[] = [
      {
        id: '269783357297131521',
        name: 'Pointless Bot',
        platform: 'nodejs',
        scriptsRunning: 5,
        avatarUrl: '//cdn.discordapp.com/avatars/269783357297131521/80c311e9817186aa764c53bd0800edba.png?size=256'
      },
      {
        id: '328441126023331850',
        name: 'Pointless Bot Dev!',
        platform: 'nodejs',
        scriptsRunning: 3,
        avatarUrl: '//cdn.discordapp.com/avatars/328441126023331850/e49ac366ce50d67a396d1d6bd186c5b9.png?size=256'
      }
    ];
  }
</script>

<style scoped>
  .bot-card {
    min-height: 200px;
  }
</style>
