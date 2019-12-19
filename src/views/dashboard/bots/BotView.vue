<template>
  <v-layout fill-height v-if="bots">
    <v-navigation-drawer permanent class="fill-height">
      <v-select
              v-if="bots && bots.nodes"
              :items="bots.nodes"
              item-value="id"
              filled
              :value="botId"
              @input="botSelectChange"
              class="bot-select"
              hide-details
      >
        <template v-slot:item="{ item }">
          <v-avatar size="32" class="mr-2">
            <img :src="item.avatarUrl">
          </v-avatar>
          <h2 class="title">{{item.name}}</h2>
        </template>
        <template v-slot:selection="{ item }">
          <v-avatar size="32" class="mr-2">
            <img :src="item.avatarUrl">
          </v-avatar>
          <h2 class="title title-cut-text">{{item.name}}</h2>
        </template>
      </v-select>
      <v-skeleton-loader v-else type="list-item-avatar" />
      <v-list shaped>
        <v-list-item to="info">
          <v-list-item-title>
            Overview
          </v-list-item-title>
        </v-list-item>
        <v-list-item disabled>
          <v-list-item-title>
            K/V Store
          </v-list-item-title>
          <v-chip small class="flex-shrink-0">WIP</v-chip>
        </v-list-item>
        <v-list-item disabled>
          <v-list-item-title>
            Webhooks
          </v-list-item-title>
          <v-chip small class="flex-shrink-0">WIP</v-chip>
        </v-list-item>
        <v-list-item to="options">
          <v-list-item-title>
            Settings
          </v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-flex>
      <router-view />
    </v-flex>
  </v-layout>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import gql from 'graphql-tag';

  interface BotsQuery {
    nodes: BotOverview[];
  }
  interface BotOverview {
    id: string;
    name: string;
    avatar: string;
  }

  @Component({
    apollo: {
      bots: gql`query GetBotsForList {
  bots {
    nodes {
      id
      name
      avatarUrl
    }
  }
}`
    }
  })
  export default class BotView extends Vue {
    public get botId() {
      return this.$route.params.id;
    }
    public bots: BotsQuery | null = null;
    public botSelectChange(v: string) {
      this.$router.push({params: {id: v}});
    }
  }
</script>

<style scoped>
  .title-cut-text {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .bot-select >>> .v-select__selections {
    /* Maybe hacky, but the -28px is to offset for the dropdown icon*/
    max-width: calc(100% - 28px);
    padding-top: 0 !important;
    flex-wrap: nowrap;
  }
</style>
