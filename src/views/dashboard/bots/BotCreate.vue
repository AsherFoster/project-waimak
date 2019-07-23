<template>
  <v-container>
    <v-expansion-panel readonly :value="step" style="max-width: 800px; margin: auto">
      <!-- Simple Details -->
      <v-expansion-panel-content :hide-actions="step <= 0">
        <template slot="header">Details</template>
        <v-icon slot="actions" color="teal">check</v-icon>

        <v-card>
          <v-card-text>
            <v-form v-model="formDetailsValid">
              <v-layout align-center justify-center>
                <v-flex class="shrink">
                  <v-avatar size="128" class="ma-3">
                    <img src="https://cdn.discordapp.com/avatars/191698332014346242/5d28178fbc89be9a0deab28f76896f56.png">
                  </v-avatar>
                </v-flex>
                <v-flex class="ma-3" sm5>
                  <v-text-field v-model="name" :rules="[required]" label="Name"></v-text-field>
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
      <!-- OAuth Setup -->
      <v-expansion-panel-content :hide-actions="step <= 1">
        <template slot="header">Link</template>
        <v-icon slot="actions" color="teal">check</v-icon>

        <v-layout justify-center>
          <v-flex md6>
            <v-form v-model="formLinkValid">
              <h2 class="headline">Now, let's get your bot running</h2>
              <v-timeline dense>
                <v-timeline-item fill-dot small>
                  <p>Download a client on your target machine:</p>
                  <code>git clone git@github.com:asherfoster/canal-client-nodejs</code>
                </v-timeline-item>
                <v-timeline-item fill-dot small>
                  <p>Start it up</p>
                  <code>cd canal-client-nodejs
                    npm i
                    npm build
                    npm start</code>
                </v-timeline-item>
                <v-timeline-item fill-dot small>
                  <p>Then enter in the token it provides here:</p>
                  <v-text-field
                          v-model="deviceCode"
                          :disabled="loading"
                          label="Device Code"
                          hint="This code should look like ABCD1234"
                          persistent-hint
                          :rules="[required, deviceCodeValidator]"
                          validate-on-blur
                          style="max-width: 300px"
                  ></v-text-field>
                </v-timeline-item>
              </v-timeline>
            </v-form>
          </v-flex>
        </v-layout>
        <v-layout>
          <v-flex></v-flex>
          <v-btn :disabled="loading" @click="step--" flat>Back</v-btn>
          <v-btn :disabled="!formLinkValid" :loading="loading" @click="submitDeviceCode">Next</v-btn>
        </v-layout>
      </v-expansion-panel-content>
      <!-- Confirmation, what next -->
      <v-expansion-panel-content hide-actions>
        <template slot="header">Done</template>
        <v-card>
          <v-card-title>
            <h2 class="headline">Woohoo!</h2>
          </v-card-title>
          <v-card-text>
            <p>You now have a working bot!</p>
            <h3 class="title">What next?</h3>
            <p>You can <router-link :to="'/dashboard/bots/' + bot.id">configure it</router-link>,
              or head to <router-link to="/dashboard/scripts">scripts</router-link> and get started writing your first script!</p>
          </v-card-text>
          <v-card-actions>
            <v-flex></v-flex>
            <v-btn :to="'/dashboard/bots/' + bot.id">Done</v-btn>
          </v-card-actions>
        </v-card>
      </v-expansion-panel-content>
    </v-expansion-panel>
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

  interface PlatformMap {
    name: string;
    id: Platform;
  }

  @Component({})
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
      this.$apollo.mutate({
        mutation: gql`mutation AddABotToAccount($bot: BotCreateInput) {
  createBot(bot: $bot) {
    id
    name
  }
}`,
        variables: {
          name: this.name,
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
      if(val && typeof val === 'string') return true;
      else return 'Field is required';
    }
    public tokenValidator(val: string): true|string {
      if(val && typeof val === 'string') {
        if(val.startsWith('mfa.')) return 'User tokens are not allowed';
        if(val.split('.').length < 3 || val.length < 59) return 'Token is incomplete';
        if(val.split('.').length > 3 || val.length > 59) return 'Token is too long';
        return true;
      } else return 'Token is required'
    }
    public deviceCodeValidator(val: string): true|string {
      if(val && typeof val === 'string' && val.length === 8) return true;
      else return 'That code doesn\'t quite look right';
    }
  }
</script>

<style scoped>

</style>
