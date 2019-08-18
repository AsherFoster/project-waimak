<template>
  <v-container class="wrapper">
    <h2 class="display-3">Admin Center</h2>
    <p>Built by <a href="//asherfoster.com">Asher Foster</a>. I'm not even going to try display the version</p>
    <p>Using an MIT license. Don't steal it, ok?</p>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  @Component({})
  export default class About extends Vue {
  }
</script>

<style scoped>
  .wrapper {
    font-size: 16px;
  }
</style>
