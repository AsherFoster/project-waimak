<template>
  <v-container>
    <p>
      Token: {{token}}
      <copy-text :value="token"></copy-text>
    </p>
    <p>
      User ID: {{user.id}}
      <copy-text :value="user.id"></copy-text>
    </p>
  </v-container>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import CopyText from '@/components/CopyText.vue';
  import {User} from '@/store/authentication';

  @Component({
    components: {CopyText}
  })
  export default class Debug extends Vue {
    get user(): User {
      return this.$store.state.auth.user;
    }
    get token(): string {
      return this.$store.state.auth.token;
    }
  }
</script>

<style scoped>

</style>
