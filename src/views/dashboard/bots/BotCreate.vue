<template>
  <v-container>
    <v-expansion-panels readonly :value="step" style="max-width: 800px; margin: auto">
      <!-- Simple Details -->
      <v-expansion-panel>
        <v-expansion-panel-header :hide-actions="step <= 0">
          Details
          <v-icon slot="actions" color="teal">check</v-icon>
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card flat>
            <v-card-text>
              <v-form v-model="formDetailsValid">
                <v-layout align-center justify-center>
                  <v-flex class="ma-3" sm5>
                    <v-text-field v-model="token" :rules="[required, tokenValidator]" label="Token"></v-text-field>
                    <v-select
                            v-model="platform"
                            :items="platforms"
                            item-text="name"
                            item-value="id"
                    ></v-select>
                  </v-flex>
                </v-layout>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-flex></v-flex>
              <v-btn @click="createBot" :loading="loading" :disabled="!formDetailsValid">Next</v-btn>
            </v-card-actions>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
      <!-- OAuth Setup -->
      <v-expansion-panel>
        <v-expansion-panel-header hide-actions>
          Done
        </v-expansion-panel-header>
        <v-expansion-panel-content>
          <v-card flat v-if="bot">
            <v-card-text>
              <v-layout justify-center align-center>
                <v-flex shrink>
                  <v-avatar size="80">
                    <img :src="bot.avatarUrl">
                  </v-avatar>
                </v-flex>
                <v-flex shrink class="ma-2">
                  <p class="headline mb-1">
                    {{bot.name}}
                    <span class="caption">#{{bot.discriminator}}</span>
                  </p>
                  <p class="caption mb-0">ID: {{bot.discordId}}</p>
                </v-flex>
              </v-layout>
              <v-divider class="my-4"></v-divider>
              <h3 class="title">What next?</h3>
              <p>Check out the <a>docs</a> for more info, or dive right in and <router-link :to="'/bots/' + bot.id">configure it</router-link>,
                or head to <router-link to="/scripts">scripts</router-link> and get started writing your first script!</p>
              <h3 class="title">Your bot's API key</h3>
              <p class="mb-0">You'll need this to connect your client to Canal</p>
              <div>
                <code>{{bot.apiKey}}</code>
                <CopyText :value="bot.apiKey"></CopyText>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-flex></v-flex>
              <v-btn text>Docs</v-btn>
              <v-btn :to="'/bots/' + bot.id">Go to bot</v-btn>
            </v-card-actions>
          </v-card>
          <v-card v-else>
            <h2>Something unexpected happened. Sorry about that.</h2>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {Platform} from '@/graphql/schema-types';
  import gql from 'graphql-tag';
  import CopyText from '@/components/CopyText.vue';

  interface PlatformMap {
    name: string;
    id: Platform;
  }
  interface Bot {
    id: string;
    name: string;
    discriminator: string;
    avatarUrl: string;
    discordId: string;
    apiKey: string;
  }

  @Component({
    components: {CopyText}
  })
  export default class BotCreate extends Vue {
    public step: number = 0;
    public loading: boolean = false;

    public token: string = '';
    public platform: Platform = 'NODEJS';
    public formDetailsValid: boolean = false;
    public readonly platforms: PlatformMap[] = [{name: 'Node.js', id: 'NODEJS'}];

    public bot: Bot | null = null;

    public formLinkValid: boolean = false;
    public async createBot(): Promise<void> {
      this.loading = true;
      const resp = await this.$apollo.mutate({
        mutation: gql`mutation AddABotToAccount($bot: BotCreateInput!) {
  createBot(bot: $bot) {
    id
    name
    discriminator
    avatarUrl
    discordId
    apiKey
  }
}`,
        variables: {
          bot: {
            platform: this.platform,
            token: this.token,
          }
        },
        refetchQueries: ['ListBots']
      });
      this.bot = resp.data.createBot;
      this.loading = false;
      this.step++;
    }
    public required(val?: string): true|string {
      if (val) return true;
      else return 'Field is required';
    }
    public tokenValidator(val: string): true|string {
      if (val) {
        if (val.startsWith('mfa.')) return 'User tokens are not allowed';
        if (val.split('.').length < 3 || val.length < 59) return 'Token is incomplete';
        if (val.split('.').length > 3 || val.length > 59) return 'Token is too long';
        return true;
      } else return 'Token is required';
    }
    public deviceCodeValidator(val: string): true|string {
      if (val && val.length === 8 && val.match(/^[a-zA-Z0-9]{8}$/)) return true;
      else return 'That code doesn\'t quite look right';
    }
  }
</script>

<style scoped>

</style>
