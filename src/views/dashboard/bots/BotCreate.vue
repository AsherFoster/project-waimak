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
              <v-btn @click="step++" :disabled="!formDetailsValid">Next</v-btn>
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
          <v-card flat>
            <v-card-text>
              <v-layout justify-center align-center>
                <v-flex shrink>
                  <v-avatar size="80">
                    <img src="//cdn.discordapp.com/avatars/269783357297131521/80c311e9817186aa764c53bd0800edba.png?size=256">
                  </v-avatar>
                </v-flex>
                <v-flex shrink class="ma-2">
                  <p class="headline mb-1">
                    Pointless Bot
                    <span class="caption">#1234</span>
                  </p>
                  <p class="caption mb-0">ID: 75827298397323264</p>
                </v-flex>
              </v-layout>
              <v-divider class="my-4"></v-divider>
              <h3 class="title">What next?</h3>
              <p>Check out the <a>docs</a> for more info, or dive right in and <router-link :to="'/dashboard/bots/' + bot.id">configure it</router-link>,
                or head to <router-link to="/dashboard/scripts">scripts</router-link> and get started writing your first script!</p>
              <h3 class="title">Your bot's API key</h3>
              <p class="mb-0">You'll need this to connect your client to Canal</p>
              <div>
                <code>6ea2081aa573d9eed3af6e608ab4bf34</code>
                <CopyText :value="'6ea2081aa573d9eed3af6e608ab4bf34'"></CopyText>
              </div>
            </v-card-text>
            <v-card-actions>
              <v-flex></v-flex>
              <v-btn text>Docs</v-btn>
              <v-btn :to="'/dashboard/bots/' + '12345'">Go to bot</v-btn>
            </v-card-actions>
          </v-card>
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-container>
</template>

<script lang="ts">
  /*
   * File todos:
   * TODO Improve logic for showing done symbol (keep when going back?)
   * */
  import {Component, Vue} from 'vue-property-decorator';
  import {Platform} from '@/graphql/schema-types';
  import gql from 'graphql-tag';
  import CopyText from '@/components/CopyText.vue';

  interface PlatformMap {
    name: string;
    id: Platform;
  }

  @Component({
    components: {CopyText}
  })
  export default class BotCreate extends Vue {
    public step: number = 0;
    public loading: boolean = false;

    public name: string = '';
    public token: string = '';
    public platform: Platform = 'NODEJS';
    public formDetailsValid: boolean = false;
    public readonly platforms: PlatformMap[] = [{name: 'Node.js', id: 'NODEJS'}];

    public bot: any = {id: 'abc123'};

    public formLinkValid: boolean = false;
    public deviceCode: string = '';
    public async submitDeviceCode(): Promise<void> {
      this.loading = true;
      await this.$apollo.mutate({
        mutation: gql`mutation AddABotToAccount($bot: BotCreateInput) {
  createBot(bot: $bot) {
    id
    name
  }
}`,
        variables: {
          platform: this.platform,
          token: this.token,
          deviceCode: this.deviceCode
        }
      });
      setTimeout(() => {
        this.loading = false;
        this.step++;
      }, 1000);
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
