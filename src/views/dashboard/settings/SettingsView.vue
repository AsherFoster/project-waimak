<template>
  <v-layout fill-height>
    <v-navigation-drawer>
      <v-list shaped>
        <v-list-item to="/settings">
          Home
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <div>
      <p>Hi, {{user.name}}</p>
      <p>Email: {{user.email}}</p>
      <v-btn color="error" text to="/settings/deleteaccount">Delete Account</v-btn>
    </div>
  </v-layout>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {State} from 'vuex-class';
  import {User} from '@/store/authentication';

  @Component({})
  export default class SettingsView extends Vue {
    @State('user', {namespace: 'auth'})
    public user!: User;
  }
</script>

<style scoped>

</style>
