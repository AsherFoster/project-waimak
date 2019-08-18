<template>
  <v-app class="wrapper" dark>
    <v-container fill-height>
      <v-layout align-center justify-center>
        <v-btn
                color="#677bc4"
                @click="startOAuth2Flow"
                x-large
        >
          <v-icon large left dark>$vuetify.icons.discord</v-icon>
          Login with Discord
        </v-btn>
      </v-layout>
      <v-btn class="corner" icon href="//asherfoster.com/things/dsbweb">
        <v-icon color="grey">info</v-icon>
      </v-btn>
    </v-container>
  </v-app>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';

  @Component({
  })
  export default class Login extends Vue {
    public infoOpen = false;
    public startOAuth2Flow = () => this.$store.dispatch('auth/startOAuth2Flow');
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
