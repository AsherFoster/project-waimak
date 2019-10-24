<template>
  <div class="fill-height">
    <v-layout fill-height v-if="bots">
      <v-navigation-drawer permanent class="fill-height">
        <v-select
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
        <v-list shaped>
          <v-list-item to="details">
            <v-list-item-title>
              Details
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="scripts">
            <v-list-item-title>
              Scripts
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="permissions">
            <v-list-item-title>
              Permissions
            </v-list-item-title>
          </v-list-item>
          <v-list-item to="options">
            <v-list-item-title>
              Options
            </v-list-item-title>
          </v-list-item>
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
  import {ConnectionState} from '@/graphql/schema-types';

  interface BotsQuery {
    nodes: BotOverview[];
  }
  interface BotOverview {
    id: string;
    name: string;
    avatar: string;
  }

  @Component({
    components: {StatusIcon},
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
