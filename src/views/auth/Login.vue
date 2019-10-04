<template>
  <v-app class="wrapper" dark>
    <v-container fill-height>
      <v-layout align-center justify-center>
        <v-btn
                color="#677bc4"
                :href="authUrl"
                x-large
        >
          <v-icon large left dark>$vuetify.icons.discord</v-icon>
          Login with Discord
        </v-btn>
      </v-layout>
      <v-btn class="corner" icon href="//canal.asherfoster.com">
        <v-icon color="grey">info</v-icon>
      </v-btn>
    </v-container>
  </v-app>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component({})
  export default class Login extends Vue {
    public authUrl: string = (process.env.NODE_ENV === 'production' ?
      'https://api.canal.asherfoster.com' :
      'http://localhost:4080') + '/oauth/discord/start';
  }
</script>

<style scoped>
  .wrapper {
    background: url(../../assets/demo-image.jpg) no-repeat center;
    background-size: cover;
    text-align: center;
  }
  .corner {
    position: absolute;
    bottom: 12px;
    right: 12px;
  }
</style>
