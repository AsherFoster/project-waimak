<template>
  <v-bottom-sheet :value="value" @input="setVisibility">
    <v-list v-if="!this.$apollo.loading">
      <v-subheader>Select bot to deploy to:</v-subheader>
      <v-list-tile v-if="!bots.nodes.length">
        <v-list-tile-avatar>
          <v-icon>warning</v-icon>
        </v-list-tile-avatar>
        <v-list-tile-title>No bots found</v-list-tile-title>
      </v-list-tile>
      <v-list-tile
              v-else
              v-for="bot in bots.nodes"
              :disabled="!bot.connection || bot.connection.state !== 'OK'"
              :key="bot.id"
              @click="select(bot.id)">
        <v-list-tile-avatar>
          <img :src="bot.avatarUrl" :class="(!bot.connection || bot.connection.state !== 'OK') && 'fade-img'">
        </v-list-tile-avatar>
        <v-list-tile-content>
          <v-list-tile-title>{{bot.name}}</v-list-tile-title>
          <v-list-tile-sub-title v-if="!bot.connection">
            Offline
          </v-list-tile-sub-title>
          <v-list-tile-sub-title v-else-if="bot.connection.state !== 'OK'">
            Bot isn't safe to deploy to: ({{bot.connection.state}})
          </v-list-tile-sub-title>
          <v-list-tile-sub-title v-else-if="bot.runningScript">
            Running
          </v-list-tile-sub-title>
        </v-list-tile-content>
      </v-list-tile>
    </v-list>
    <v-progress-circular v-else indeterminate></v-progress-circular>
  </v-bottom-sheet>
</template>

<script lang="ts">
  import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
  import gql from 'graphql-tag';
  import {ConnectionState, ScriptState} from '@/graphql/schema-types';

  interface Bot {
    id: string;
    name: string;
    avatarUrl: string;
    runningScript?: {
      state: ScriptState
    };
    connection: {
      state: ConnectionState
    };
  }
  interface BotQuery {
    nodes: Bot[];
  }

  @Component({
    apollo: {
      bots() {
        return {
          query: gql`query ListAllBotsForSelection($id: String!) {
  bots {
    nodes {
      id
      name
      avatarUrl
      runningScript(id: $id) {
        state
      }
      connection {
        state
      }
    }
  }
}`,
          variables: {
            id: this.script
          }
        };
      }
    },
    watch: {
      value(val: boolean) {
        if (val) {
          this.$apollo.queries.bots.refetch();
        }
      }
    }
  })
  export default class SelectBot extends Vue {
    public bots: BotQuery | null = null;
    @Prop({required: true}) public value!: boolean;
    @Prop({required: true}) public script!: string;

    @Emit('input') public setVisibility(val: boolean): boolean {
      return val;
    }
    public select(id: string) {
      this.$emit('selected', id);
      this.setVisibility(false);
    }
  }
</script>

<style scoped>
  .fade-img {
    opacity: 0.6;
  }
</style>
