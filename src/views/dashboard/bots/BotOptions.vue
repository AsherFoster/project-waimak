<template>
  <v-container>
    <h2>Bot Options</h2>
    <p>These options could potentially break your bot, proceed with caution.</p>
    <div v-if="bot">
      <v-divider />
      <v-subheader>Sharing <v-chip small>WIP</v-chip></v-subheader>
      <v-container>
        <v-list>
          <v-list-item>
            You (owner)
          </v-list-item>
        </v-list>
      </v-container>

      <v-divider />
      <v-subheader>Token</v-subheader>
      <v-layout align-center>
        <v-text-field
                v-model="tokenValue"
                :disabled="!editingToken"
                style="max-width: 300px"
                :error-messages="tokenSaveError"
        />
        <CopyText :value="bot.token" v-if="!editingToken" />
        <v-btn icon @click="editingToken = !editingToken" v-if="!editingToken">
          <v-icon>edit</v-icon>
        </v-btn>
        <v-btn v-else @click="saveToken()" :loading="savingToken">
          Save
        </v-btn>
      </v-layout>

      <v-alert class="mt-4" color="error" colored-border border="left">Danger Zone</v-alert>
      <v-dialog max-width="350" v-model="deleteConfirmOpen">
        <template #activator="{ on }">
          <v-btn v-on="on">Delete Bot</v-btn>
        </template>
        <v-card>
          <v-card-title>Confirm Delete</v-card-title>
          <v-card-text>
            <p>Please type <b>{{bot.name}}</b> to confirm</p>
            <v-text-field v-model="deleteConfirmValue" />
          </v-card-text>
          <v-card-actions>
            <v-flex />
            <v-btn text @click="deleteConfirmOpen = false">Cancel</v-btn>
            <v-btn color="error" :disabled="deleteConfirmValue !== bot.name" @click="deleteBot" :loading="deleting">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import gql from 'graphql-tag';
  import CopyText from '@/components/CopyText.vue';

  interface Bot {
    id: string;
    name: string;
    token: string;
  }

  @Component({
    components: {CopyText},
    apollo: {
      bot: {
        query: gql`query GetBotName($bot: String!) {
bot(id: $bot) {
  id
  name
  ... on DiscordBot {
    token
  }
}
}`,
        variables() {
          return {
            bot: this.$route.params.id
          };
        },
        result(this: BotOptions, d: any) {
          this.tokenValue = d.data.bot.token;
        }
      }
    }
  })
  export default class BotOptions extends Vue {
    public bot: Bot | null = null;

    public tokenValue: string = '';
    public editingToken: boolean = false;
    public savingToken: boolean = false;
    public tokenSaveError: string = '';

    public deleteConfirmValue: string = '';
    public deleteConfirmOpen: boolean = false;
    public deleting: boolean = false;

    public async saveToken(): Promise<void> {
      if (!this.bot) return;
      if (this.tokenValue === this.bot.token) {
        this.editingToken = false;
        return;
      }

      this.savingToken = true;

      try {
        await this.$apollo.mutate({
          mutation: gql`mutation ChangeBotToken($bot: BotUpdateInput!) {
    updateBot(bot: $bot) {
      id
      name
      avatarUrl
      ... on DiscordBot {
        token
      }
    }
  }`,
          variables: {
            bot: {
              id: this.bot.id,
              token: this.tokenValue
            }
          }
        });
        this.editingToken = false;
        this.tokenSaveError = '';
      } catch (e) {
        this.tokenSaveError = 'Unable to save token. Are you sure it\'s correct?';
      }
      this.savingToken = false;
    }
    public async deleteBot(): Promise<void> {
      this.deleting = true;
      await this.$apollo.mutate({
        mutation: gql`mutation DeleteBot($id: String!) {
deleteBot(bot: $id)
}`,
        variables: {
          id: this.$route.params.id
        },
        refetchQueries: [{
          query: gql`query UpdateBotsAfterDelete {
  bots {
    nodes {
      id
      name
    }
  }
}`
        }]
      });
      this.deleting = this.deleteConfirmOpen = false;
      this.$router.push('/');
    }
  }
</script>

<style scoped>

</style>
