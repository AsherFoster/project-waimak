<template>
  <v-content>
    <h2>Please read the following</h2>
    <p>By deleting your Canal account, all related data for your account will be removed. This means</p>
    <ul>
      <li>All your bots connected to Canal will stop functioning</li>
      <li>Your scripts will be deleted permanently</li>
      <li>Any collaborators will lose access to resources you own</li>
    </ul>
    <v-checkbox v-model="accepted" label="I have read and understand the above"></v-checkbox>
    <v-btn :disabled="!accepted" color="error" @click="doDeleteAccount">Permanently delete my account</v-btn>
  </v-content>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component({})
  export default class DeleteAccount extends Vue {
    public accepted: boolean = false;
    public doDeleteAccount() {
      
    }
  }
</script>

<style scoped>

</style>
