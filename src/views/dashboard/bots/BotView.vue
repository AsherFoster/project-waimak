<template>
  <div class="fill-height">
    <v-layout fill-height>
      <v-navigation-drawer permanent class="fill-height">
        <v-toolbar flat color="transparent">
          <v-avatar>
            <img src="//cdn.discordapp.com/avatars/269783357297131521/80c311e9817186aa764c53bd0800edba.png?size=256">
          </v-avatar>
          <v-toolbar-title>Pointless Bot</v-toolbar-title>
          <StatusIcon mode="error" :online="false"></StatusIcon>
        </v-toolbar>
        <v-divider></v-divider>
        <v-list>
          <v-list-tile to="details">
            <v-list-tile-title>
              Details
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile to="scripts">
            <v-list-tile-title>
              Scripts
            </v-list-tile-title>
          </v-list-tile>
          <v-list-tile to="permissions">
            <v-list-tile-title>
              Permissions
            </v-list-tile-title>
          </v-list-tile>
        </v-list>
      </v-navigation-drawer>
      <v-flex>
        <router-view></router-view>
      </v-flex>
    </v-layout>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import StatusIcon from '@/components/StatusIcon.vue';

  @Component({
    components: {StatusIcon}
  })
  export default class BotView extends Vue {
    public pane = 1;
    get routeId() {
      return this.$route.params.id
    }
  }
</script>

<style scoped>

</style>
