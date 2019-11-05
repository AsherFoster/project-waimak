<template>
  <v-app class="wrapper" dark>
    <v-container fill-height>
      <v-layout align-center justify-center>
        <div v-if="authed === false">
          <div class="top-spacer"></div>
          <v-btn
                  color="#677bc4"
                  :href="authUrl"
                  x-large
          >
            <v-icon large left dark>$vuetify.icons.discord</v-icon>
            Login with Discord
          </v-btn>
          <div class="spacer"></div>
          <v-btn text :href="siteUrl">Home</v-btn>
          <v-btn text :href="docsUrl">Get Help</v-btn>
        </div>
        <v-progress-circular v-else indeterminate></v-progress-circular>
      </v-layout>
    </v-container>
  </v-app>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import {checkAuthentication} from '@/util';
  import {API_BASE, DOCS_URL, SITE_BASE} from '@/constants';

  @Component({})
  export default class Login extends Vue {
    public authed: boolean | null = null;
    public siteUrl: string = SITE_BASE;
    public docsUrl: string = DOCS_URL;
    public get authUrl(): string {
      return API_BASE + '/oauth/discord/start';
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
  .top-spacer {
    height: 24px;
  }
  .spacer {
    height: 16px;
  }
  hr {
    margin: 20px auto;
    width: 40px;
  }
</style>
