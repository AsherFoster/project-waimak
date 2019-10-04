<template>
  <v-app>
    <v-container fill-height>
      <v-layout align-center justify-center>
        <div v-if="!error">
          <p>Beep boop, we're logging you in!</p>
          <v-progress-circular indeterminate=""></v-progress-circular>
        </div>
        <v-card v-else class="the-card">
          <v-card-title primary-title>
            <div>
              <h1 class="headline">{{'Auth Failed.'}}</h1>
              <p>{{error}}</p>
            </div>
          </v-card-title>
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

    public next() {
      this.$router.push('/');
    }

    public async created() {
      const search = window.location.search;
      const query = new URLSearchParams(search);
      if (query.get('error')) {
        this.error = query.get('error');
      } else if (query.get('sess') && query.get('expires')) {
        // this.newUser = query.get('newuser') === 'true';
        console.log('Saving token!', query.get('sess'));
        localStorage.setItem('auth_token', query.get('sess') as string);
        localStorage.setItem('auth_expires', new Date(+(query.get('expires') as string)).toISOString());
      } else {
        this.error = 'Malformed callback. Try logging in again';
      }
      this.next();
    }
  }
</script>

<style scoped>

</style>
