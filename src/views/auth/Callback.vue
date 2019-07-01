<template>
  <v-app class="wrapper" dark>
    <v-container fill-height>
      <v-layout align-center justify-center>
        <v-card v-if="!token && !error" class="the-card">
          <v-container>
            <v-progress-circular indeterminate=""></v-progress-circular>
          </v-container>
        </v-card>
        <v-card v-else-if="token" class="the-card">
          <v-card-title primary-title>
            <h1 class="headline">Success!</h1>
          </v-card-title>
          <v-container>
            <v-layout align-center justify-center column>
              <code v-if="token">
                token_type: {{token.tokenType}}
                accessToken: {{token.accessToken}}
                expires: {{token.expires}}
              </code>
              <v-btn @click="saveLogin">Continue</v-btn>
            </v-layout>
          </v-container>
        </v-card>
        <v-card v-else class="the-card">
          <v-card-title primary-title>
            <div>
              <h1 class="headline">{{error.title || 'Auth Failed.'}}</h1>
              <p>{{error.message}}</p>
              <code>{{error.code}}</code>
            </div>
          </v-card-title>
        </v-card>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {discordAuth} from '@/rest/account';
  import * as ClientOAuth2 from 'client-oauth2';

  @Component({})
  export default class Callback extends Vue {
    public token: ClientOAuth2.Token|null = null;
    public error: {title: string, message: string, code: string}|null = null;
    public created() {
      const state = localStorage.getItem('oauth2state');
      if (!state) {
        return this.error = {
          title: 'Authentication Failed',
          message: 'The authentication request was invalid. Please try again',
          code: 'err-auth-bad-state'
        };
      }
      const hash = this.$route.hash;
      discordAuth.token.getToken('#' + hash.substr(2), {state}).then((token) => {
        this.token = token;
      }).catch((e) => {
        console.error(e);
        this.error = {
          title: 'Authentication Failed',
          message: 'Failed to parse the authentication response. Please try again',
          code: 'err-auth-get-token-thrown'
        };
      });
    }
    public saveLogin() {
      this.$store.dispatch('auth/oAuth2Callback');
    }
  }
</script>

<style scoped>
  .the-card {
    min-width: 400px;
    max-width: 90vw;
  }
</style>
