<template>
  <v-app>
    <v-container fill-height>
      <v-layout align-center justify-center>
        <v-progress-circular v-if="!name" indeterminate=""></v-progress-circular>
        <v-card v-else-if="name" class="the-card">
          <v-card-title primary-title>
            <h1 class="headline">Success!</h1>
          </v-card-title>
          <v-container>
            <v-layout align-center justify-center column>
              <code>
                session token: {{sessionToken}}
                expires: {{expires}}
                You are: {{name}}
              </code>
              <v-btn @click="next">Continue</v-btn>
            </v-layout>
          </v-container>
        </v-card>
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
    public newUser: boolean = false;
    public sessionToken: string = '';
    public provider: string = '';
    public expires: number = 0;
    public error: string | null = null;
    public name: string | null = '';

    public next() {
      this.$router.push('/dashboard');
    }

    public async created() {
      const search = window.location.search;
      const query = new URLSearchParams(search);
      if (query.get('error')) {
        this.error = query.get('error');
      } else {
        this.newUser = query.get('newuser') === 'true';
        this.sessionToken = query.get('sess') as string;
        this.provider = query.get('provider') as string;
        this.expires = +(query.get('expires') as string);
        localStorage.setItem('auth_token', query.get('sess') as string);
        localStorage.setItem('auth_expires',
          // Sets auth_expires to current time plus expiry duration
          new Date(Date.now () + (+(query.get('expires') as string) * 1000)).toISOString()
        );
      }
      const userQuery = await this.$apollo.query({
        query: gql`query GetCurrentUsersName {
  user {
    id
    name
  }
}`
      });
      this.name = userQuery.data.user.name;
    }
  }
</script>

<style scoped>

</style>
