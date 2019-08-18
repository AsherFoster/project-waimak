<template>
  <v-bottom-sheet :value="value" @input="setVisibility">
    <v-card flat>
      <v-list v-if="!this.$apollo.loading && bots && bots.nodes.length">
        <v-subheader>Select bot to deploy to:</v-subheader>
        <v-list-item
                v-for="bot in bots.nodes"
                :key="bot.id"
                @click="select(bot.id)"
                :two-line="!!getDeployWarnings(bot)">
          <v-list-item-avatar>
            <img :src="bot.avatarUrl">
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{bot.name}}</v-list-item-title>
            <v-list-item-subtitle v-if="getDeployWarnings(bot)">
              {{getDeployWarnings(bot)}}
            </v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <p class="title mb-0 py-4 pl-2" v-else-if="!this.$apollo.loading && !bots.nodes.length">
          <v-icon>warning</v-icon>
          No bots found
      </p>
      <div v-else class="pl-6 py-4">
        <v-progress-circular indeterminate></v-progress-circular>
      </div>
    </v-card>
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
    script?: {
      state: ScriptState | null
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
      script(id: $id) {
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
    public getDeployWarnings(bot: Bot): string | null {
      const warns = [];
      if (bot.connection && bot.connection.state !== 'OK') warns.push('Bot may not be safe to deploy to');
      if (!bot.connection && !bot.script) warns.push('Script will be deployed when bot next connects');
      if (bot.connection && bot.script) warns.push('Script will be restarted');
      if (!bot.connection && bot.script) warns.push('Bot is offline, script will not be restarted');

      return warns.length ? warns.join(', ') : null;
    }
  }
</script>

<style scoped>
</style>
