<template>
  <v-app>
    <v-container fill-height>
      <v-layout align-center justify-center>
        <v-layout v-if="!error" align-center justify-center column>
          <v-progress-circular indeterminate></v-progress-circular>
          <p class="caption">Beep boop, we're logging you in!</p>
        </v-layout>
        <v-card v-else class="the-card">
          <v-card-title primary-title>
            <h1 class="headline">Login failed :(</h1>
          </v-card-title>
          <v-card-text>
            <p>{{message}}</p>
            <p class="caption">{{error}}</p>
          </v-card-text>
        </v-card>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import gql from 'graphql-tag';

  @Component({})
  export default class AuthComplete extends Vue {
    public error: string | null = null;
    public errorMap: {[key: string]: string} = {
      'invalid-key': 'Your invite key doesn\'t appear to be valid. It might have expired. You should ask for another one',
      'missing-code': 'Something went wrong while authenticating. Did you cancel it?',
      'token-invalid': 'Something went wrong while authenticating: the token provided by Discord didn\'t work',
      'invalid-state': 'The request appears to have been tampered with, and has been denied.',
      'internal-malformed': 'Malformed callback. Try logging in again'
    };
    public get message() {
      // Cast is safe because it can be wrong and still safe
      return this.errorMap[this.error as string] || 'An unknown error occurred';
    }

    public next() {
      this.$router.push('/');
    }

    public async created() {
      const search = window.location.search;
      const query = new URLSearchParams(search);
      if (query.get('error')) {
        this.error = query.get('error') as string;
      } else if (query.get('sess') && query.get('expires')) {
        localStorage.setItem('auth_token', query.get('sess') as string);
        localStorage.setItem('auth_expires', new Date(+(query.get('expires') as string)).toISOString());
        this.next();
      } else {
        this.error = 'internal-malformed';
      }
    }
  }
</script>

<style scoped>

</style>
