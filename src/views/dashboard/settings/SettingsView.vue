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
      <p>Hi, Pointless</p>
      <p>Email: me@asherfoster.com</p>
      <v-btn color="error" text to="/settings/deleteaccount">Delete Account</v-btn>
    </div>
  </v-layout>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component({})
  export default class SettingsView extends Vue {
  }
</script>

<style scoped>

</style>
