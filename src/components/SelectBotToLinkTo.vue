<template>
  <v-dialog :value="value" @input="input" max-width="600">
    <v-card>
      <v-card-title>Select a bot to link to...</v-card-title>
      <v-list v-if="bots">
        <v-list-item v-for="bot in bots.nodes" :key="bot.id" @click="select(bot)" :disabled="!!bot.module">
          <v-list-item-avatar>
            <v-avatar>
              <v-img :src="bot.avatarUrl" />
            </v-avatar>
          </v-list-item-avatar>
          <v-list-item-content>
            <v-list-item-title>{{bot.name}}</v-list-item-title>
            <v-list-item-subtitle v-if="bot.module">Already linked to this bot</v-list-item-subtitle>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-dialog>
</template>

<script lang="ts">
  import {Component, Emit, Prop, Vue} from 'vue-property-decorator';
  import gql from 'graphql-tag';

  interface Bot {
    id: string;
    name: string;
    avatarUrl: string;
    module: {
      created: Date;
    };
  }
  interface BotQuery {
    nodes: Bot[];
  }

  @Component({
    apollo: {
      bots: {
        query: gql`query GetBotsToLinkTo($module: String!) {
  bots {
    nodes {
      id
      name
      avatarUrl
      module(id: $module) {
        created
      }
    }
  }
}`,
        variables() {
          return {
            module: this.module
          };
        }
      }
    }
  })
  export default class SelectBotToLinkTo extends Vue {
    @Prop({default: false})
    public value!: boolean;
    @Prop({required: true})
    public module!: string;

    public bots: BotQuery | null = null;

    @Emit()
    public input(bot?: Bot): Bot | null {
      return bot || null;
    }
    public async select(bot: Bot) {
      this.linkToBot(bot.id);
      this.input(bot);
    }

    public async linkToBot(id: string) {
      if (!this.module) return;
      await this.$apollo.mutate({
        mutation: gql`mutation LinkModuleToBot($module: String!, $bot: String!) {
    linkModuleToBot(module: $module, bot: $bot) {
      bot {
        id
      }
    }
  }`,
        variables: {
          module: this.module,
          bot: id
        }
      });
    }
  }
</script>

<style scoped>

</style>
