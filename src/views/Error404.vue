<template>
  <v-container>
    <v-layout align-center fill-height column>
      <p style="font-size: 120px; font-family: monospace">:(</p>
      <h1>Error 404</h1>
      <p>That page wasn't found. Sorry :(</p>
      <a @click="$router.go(-1)">Back</a>
    </v-layout>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component({})
  export default class Error404 extends Vue {
  }
</script>

<style scoped>

</style>
