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
    <p>Please enter your email ({{account.email}}) below:</p>
    <v-text-field
            v-model="enteredEmail"
            :disabled="!accepted"
            label="Email"
            style="width: 300px"
    ></v-text-field>

    <v-btn :disabled="!accepted || enteredEmail !== account.email" color="error" @click="doDeleteAccount">Permanently delete my account</v-btn>
  </v-content>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {State} from 'vuex-class';
  import {User} from '@/store/authentication';

  @Component({})
  export default class DeleteAccount extends Vue {
    public accepted: boolean = false;
    public enteredEmail: string = '';
    @State('user', {namespace: 'auth'}) public account!: User;
    public doDeleteAccount() {}
  }
</script>

<style scoped>

</style>
