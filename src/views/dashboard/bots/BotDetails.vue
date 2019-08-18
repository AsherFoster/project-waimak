<template>
  <v-card v-if="bot">
    <v-layout align-center pa-3>
      <v-avatar size="100">
        <img :src="bot.avatarUrl">
      </v-avatar>
      <h2 class="ml-3">
        <span class="display-1">{{bot.name}}</span>
      </h2>
      <StatusIcon :connection="bot.connection"></StatusIcon>
      <v-spacer></v-spacer>
      <div>
        <v-btn icon color="error">
          <v-icon>delete</v-icon>
        </v-btn>
      </div>
    </v-layout>
    <v-card-text>
      <p>Platform: {{bot.platform}}</p>
      <p>Created: {{bot.created | momentnow}}</p>
      <p>API Key: {{bot.apiKey}}<CopyText :value="bot.apiKey" /></p>
    </v-card-text>
  </v-card>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import gql from 'graphql-tag';
  import StatusIcon from '@/components/StatusIcon.vue';
  import CopyText from '@/components/CopyText.vue';

  interface BotQueryResult {
    id: string;
    name: string;
    apiKey: string;
    avatarUrl?: string;
    platform: string;
    created: Date;
  }

  @Component({
    components: {CopyText, StatusIcon},
    apollo: {
      bot() {
        return {
          query: gql`query GetBotDetails($id: String!) {
  bot(id: $id) {
    id
    name
    apiKey
    avatarUrl
    platform
    created
  }
}`,
          variables() {
            return {
              id: this.$route.params.id
            };
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
