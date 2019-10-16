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

  @Component({})
  export default class Error extends Vue {
    public reload() {
      window.location.href = '/app';
    }
  }
</script>

<style scoped>

</style>
