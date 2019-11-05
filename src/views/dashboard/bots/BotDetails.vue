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
      <v-menu offset-y>
        <template v-slot:activator="{ on }">
          <v-btn icon color="error" v-on="on">
            <v-icon>delete</v-icon>
          </v-btn>
        </template>
        <v-card>
          <v-list>
            <v-list-item @click="">
              <v-list-item-icon>
                <v-icon>cancel</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Cancel</v-list-item-title>
            </v-list-item>
            <v-list-item @click="deleteBot">
              <v-list-item-icon>
                <v-icon>delete</v-icon>
              </v-list-item-icon>
              <v-list-item-title>Confirm</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card>
      </v-menu>
    </v-layout>
    <v-card-text>
      <p>Platform: {{bot.platform}}</p>
      <p>Created: {{bot.created | cMomentNow}}</p>
      <v-layout align-center>
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
      <v-layout align-center>
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
    connection?: {
      state: string;
      created: Date;
    };
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
    connection {
        state
        created
    }
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
    public async deleteBot(): Promise<void> {
      await this.$apollo.mutate({
        mutation: gql`mutation DeleteBot($id: String!) {
deleteBot(bot: $id)
}`,
        variables: {
          id: this.bot && this.bot.id
        }
      });
      this.$router.push('/bots');
    }
  }
</script>

<style scoped>

</style>
