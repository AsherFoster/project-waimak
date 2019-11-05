<template>
  <v-bottom-sheet :value="value" @input="setVisibility">
    <v-card flat>
      <v-list v-if="!this.$apollo.loading && bots && bots.nodes.length">
        <v-subheader>Select bot to deploy to:</v-subheader>
        <v-list-item
                v-for="bot in botsWithWarnings"
                :key="bot.id"
                :disabled="bot.warnings.blocking"
                @click="select(bot)"
                :two-line="!!bot.warnings">
          <v-list-item-avatar>
            <img :src="bot.avatarUrl">
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{bot.name}}</v-list-item-title>
            <v-list-item-subtitle v-if="bot.warnings">
              {{bot.warnings.text}}
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
  import {ClientState, ScriptState} from '@/graphql/schema-types';

  interface Bot {
    id: string;
    name: string;
    avatarUrl: string;
    script?: {
      state: ScriptState | null
    };
    connection: {
      state: ClientState
    };
  }
  interface BotQuery {
    nodes: Bot[];
  }
  interface BotWarnings {
    blocking: boolean;
    text: string;
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
    public select(bot: Bot) {
      this.$emit('selected', bot.id, !bot.script);
      this.setVisibility(false);
    }
    public getDeployWarnings(bot: Bot): BotWarnings {
      const warns = [];
      if (bot.connection) {
        const state = bot.connection.state;
        if (state === 'STARTUP') warns.push({blocking: true, text: 'Cannot deploy to bot in STARTUP'});
        else if (state === 'ERROR') warns.push({blocking: true, text: 'Bot is ERRORed and is not safe to deploy to'});
        else if (state !== 'ONLINE') warns.push({blocking: false, text: 'Script will be deployed when bot connects'});
        if (bot.script) warns.push({blocking: false, text: 'Script will be restarted'});
      } else {
        if (!bot.script) warns.push({blocking: false, text: 'Script will be deployed when bot connects'});
        else warns.push({blocking: true, text: 'Script is linked but bot is offline. This will do nothing'});
      }

      return {
        blocking: warns.some((w) => w.blocking),
        text: warns.map((w) => w.text).join(', ')
      };
    }
    public get botsWithWarnings(): Array<Bot | BotWarnings> {
      if (!this.bots || !this.bots.nodes) return [];
      return this.bots.nodes.map((bot) => ({...bot, warnings: this.getDeployWarnings(bot)}));
    }
  }
</script>

<style scoped>
</style>
