<template>
  <v-app>
    <v-layout align-center fill-height column>
      <p style="font-size: 120px; font-family: monospace">:(</p>
      <h1>Our bad</h1>
      <p>Something went really wrong. This has been reported</p>
      <a @click="reload()">Reload</a>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import * as Sentry from '@sentry/browser';

  @Component({})
  export default class ErrorPage extends Vue {
    public created() {
      if (this.$route.query.error) {
        Sentry.captureException(new Error(`Error page invoked, reason: ${this.$route.query.error}`));
      }
    }
    public reload() {
      window.location.href = '/';
    }
  }
</script>

<style scoped>

</style>
