<template>
  <v-card v-if="bot">
    <v-layout align-center pa-3>
      <v-avatar size="100">
        <img :src="bot.avatarUrl">
      </v-avatar>
      <h2 class="ml-3">
        <span class="display-1">{{bot.name}}</span>
<!--        <span class="caption ma-0">#1337</span>-->
      </h2>
      <v-spacer></v-spacer>
      <div>
        <v-btn icon flat color="error">
          <v-icon>delete</v-icon>
        </v-btn>
      </div>
    </v-layout>
    <v-card-text>
      <p>Platform: {{bot.platform}}</p>
      <p>Created: {{bot.created | momentnow}}</p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import gql from 'graphql-tag';

  interface BotQueryResult {
    name: string;
    avatarUrl?: string;
    platform: string;
    created: Date;
  }

  @Component({
    apollo: {
      bot() {
        return {
          query: gql`query GetBotForOverview($id: String!) {
  bot(id: $id) {
    name
    avatarUrl
    platform
    created
  }
}`,
          variables: {
            id: this.$route.params.id
          }
        };
      }
    }
  })
  export default class BotDetails extends Vue {
    public bot: BotQueryResult | null = null;
  }
</script>

<style scoped>

</style>
