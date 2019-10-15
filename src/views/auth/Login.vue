<template>
  <v-app class="wrapper" dark>
    <v-container fill-height>
      <v-layout align-center justify-center>
        <v-btn
                v-if="authed === false"
                color="#677bc4"
                :href="authUrl"
                x-large
        >
          <v-icon large left dark>$vuetify.icons.discord</v-icon>
          Login with Discord
        </v-btn>
        <v-progress-circular v-else indeterminate></v-progress-circular>
      </v-layout>
      <v-btn class="corner" icon href="//canal.nz">
        <v-icon color="grey">info</v-icon>
      </v-btn>
    </v-container>
  </v-app>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import {apiHost, checkAuthentication} from '@/util';

  @Component({})
  export default class Login extends Vue {
    public authed: boolean | null = null;
    public get authUrl(): string {
      return apiHost + '/oauth/discord/start';
    }

    public async created() {
      this.authed = await checkAuthentication();
      if (this.authed) {
        this.$router.push('/');
      }
    }
  }
</script>

<style scoped>
  .wrapper {
    background: url(../../assets/swirly.png) no-repeat center;
    background-size: cover;
    text-align: center;
  }
  .corner {
    position: absolute;
    bottom: 12px;
    right: 12px;
  }
</style>
