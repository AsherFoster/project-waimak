<template>
  <v-card>
    <v-layout align-center pa-3>
      <v-avatar size="100">
        <img :src="bot.avatarUrl">
      </v-avatar>
      <h2 class="ml-3">
        <span class="display-1">{{bot.name}}</span>
        <span class="caption ma-0">#1337</span>
      </h2>
      <v-spacer></v-spacer>
      <div>
        <v-btn icon flat color="error">
          <v-icon>delete</v-icon>
        </v-btn>
      </div>
    </v-layout>
    <v-card-text>
      <p>Platform: Node.js</p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component({})
  export default class BotDetails extends Vue {
    public bot = {
      id: '269783357297131521',
      name: 'Pointless Bot',
      platform: 'nodejs',
      scriptsRunning: 5,
      avatarUrl: '//cdn.discordapp.com/avatars/269783357297131521/80c311e9817186aa764c53bd0800edba.png?size=256'
    };
  }
</script>

<style scoped>

</style>
