<template>
  <div class="fill-height">
    <v-layout fill-height v-if="bot">
      <v-navigation-drawer permanent class="fill-height">
        <v-toolbar flat color="transparent">
          <v-avatar>
            <img src="//cdn.discordapp.com/avatars/269783357297131521/80c311e9817186aa764c53bd0800edba.png?size=256">
          </v-avatar>
          <v-toolbar-title>{{bot.name}}</v-toolbar-title>
          <StatusIcon :mode="bot.connection.state" :online="!!bot.connection"></StatusIcon>
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
  import gql from 'graphql-tag';
  import {BotState} from '@/graphql/schema-types';

  interface BotQueryResult {
    name: string;
    platform: string;
    connection: {
      state: BotState;
    };
  }

  @Component({
    components: {StatusIcon},
    apollo: {
      bot() {
        return {
          query: gql`query GetBotForOverview($id: String!) {
  bot(id: $id) {
    name
    platform
    connection {
        state
    }
  }
}`,
          variables: {
            id: this.$route.params.id
          }
        };
      }
    }
  })
  export default class BotView extends Vue {
    public bot: BotQueryResult | null = null;
  }
</script>

<style scoped>

</style>
