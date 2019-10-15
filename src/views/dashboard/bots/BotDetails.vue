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
      <v-layout>
        <v-text-field
                style="max-width: 400px;"
                :value="bot.apiKey"
                readonly
                label="API Key"
                :append-icon="keyShown ? 'visibility_off' : 'visibility'"
                :type="keyShown ? 'text' : 'password'"
                @click:append="keyShown = !keyShown"
        ></v-text-field>
        <CopyText :value="bot.apiKey" />
      </v-layout>
      <v-layout>
        <v-text-field style="max-width: 400px;" :value="inviteLink" readonly label="Invite Link"></v-text-field>
        <CopyText :value="inviteLink" />
      </v-layout>
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
    public keyShown: boolean = false;

    public get inviteLink(): string {
      if (!this.bot) return '';
      return `https://discordapp.com/oauth2/authorize?client_id=${this.bot.id}&scope=bot`;
    }
  }
</script>

<style scoped>

</style>
