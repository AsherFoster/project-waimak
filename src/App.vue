<template>
  <router-view></router-view>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component({})
  export default class App extends Vue {
  }
</script>

<style scoped>
  .center-text {
    position: relative;
    text-align: center;
    color: #FFF;
    font-family: Roboto, sans-serif;
    top: calc(50vh - 52px);
  }
  .center-text .material-icons {
    font-size: 72px;
  }
</style>
