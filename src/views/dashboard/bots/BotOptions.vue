<template>
  <v-container>
    <h2>Bot Options</h2>
    <p>These options could potentially break your bot, proceed with caution.</p>
    <v-subheader>Token</v-subheader>
    <v-btn>Edit Token</v-btn>
    <v-subheader>Command Mode</v-subheader>
    <v-select :items="['@Mention', '.prefix', 'Custom']" style="max-width: 200px"></v-select>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component({})
  export default class BotOptions extends Vue {
  }
</script>

<style scoped>

</style>
