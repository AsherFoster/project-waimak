<template>
  <div v-if="!$apollo.loading">
    <v-toolbar dense>
      <span v-if="selected.length">{{selected.length}} script{{selected.length > 1 ? 's' : ''}} selected</span>
      <v-spacer></v-spacer>
      <v-btn icon @click="refreshList">
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-btn icon :disabled="!selected.length" @click="stopSelected">
        <v-icon>stop</v-icon>
      </v-btn>
    </v-toolbar>
    <v-data-table
            v-if="bot.scripts.nodes.length"
            :headers="tableHeaders"
            :items="bot.scripts.nodes"
            show-select
            v-model="selected"
            hide-default-footer
            item-key="script.id"
    >
      <template v-slot:item.started="{ item }">
        {{item.lastStarted | cMomentNow}}
      </template>
      <template v-slot:item.state="{ item }">
        {{item.state | cScriptState}}
      </template>
      <template v-slot:item.actions="{ item }">
        <v-layout justify-end>
          <v-menu>
            <template v-slot:activator="{ on }">
              <v-btn icon v-on="on">
                <v-icon>more_vert</v-icon>
              </v-btn>
            </template>
            <v-card>
              <v-list>
                <v-list-item @click="restartScript(item.script.id)">
                  <v-list-item-action>
                    <v-icon>refresh</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Restart</v-list-item-title>
                </v-list-item>
                <v-list-item @click="stopScript(item.script.id)">
                  <v-list-item-action>
                    <v-icon>stop</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Stop</v-list-item-title>
                </v-list-item>
                <v-list-item :to="'/scripts/' + item.script.id">
                  <v-list-item-action>
                    <v-icon>info</v-icon>
                  </v-list-item-action>
                  <v-list-item-title>Details</v-list-item-title>
                </v-list-item>
              </v-list>
            </v-card>
          </v-menu>
        </v-layout>
      </template>
    </v-data-table>
    <v-layout justify-center v-else my-4>
      <h2 class="headline">No scripts running</h2>
    </v-layout>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import gql from 'graphql-tag';

  interface ScriptLink {
    script: {
      id: string;
      name: string;
    };
    lastStarted: string;
    state: string;
  }
  interface BotQuery {
    id: string;
    scripts: {
      nodes: ScriptLink[];
    };
  }

  @Component({
    apollo: {
      bot() {
        return {
          query: gql`query GetScriptsForBot($id: String!) {
  bot(id: $id) {
    id
    scripts {
        nodes {
          script {
            id
            name
          }
          lastStarted
          state
        }
    }
  }
}`,
          variables() {
            return {
              id: this.$route.params.id
            };
          }
        };
      }
    }
  })
  export default class BotScripts extends Vue {
    public bot: BotQuery | null = null;
    public readonly tableHeaders = [
      {
        text: 'Name',
        value: 'script.name'
      },
      {
        text: 'Started',
        value: 'started'
      },
      {
        text: 'State',
        value: 'state'
      },
      {
        text: '',
        value: 'actions',
        sortable: false,
        align: 'end'
      }
    ];
    public selected: ScriptLink[] = [];
    public async refreshList(): Promise<void> {
      await this.$apollo.queries.bot.refetch();
    }
    public async restartScript(id: string, reloadAfter: boolean = true) {
      if (!this.bot) return; // Sanity check
      await this.$apollo.mutate({
        mutation: gql`
mutation RestartScriptOnBot($bot: String!, $script: String!) {
  restartScriptOnBot(bot: $bot, script: $script) {
    lastStarted
  }
}
        `,
        variables: {
          bot: this.bot.id,
          script: id
        }
      });
      if (reloadAfter) await this.refreshList();
    }
    public async stopScript(id: string, reloadAfter: boolean = true): Promise<void> {
      await this.$apollo.mutate({
        mutation: gql`
mutation RemoveScriptFromBot($bot: String!, $script: String!) {
  removeScriptFromBot(bot: $bot, script: $script)
}
        `,
        variables: {
          bot: (this.bot as BotQuery).id,
          script: id
        }
      });
      if (reloadAfter) this.refreshList();
    }
    public async restartSelected() {
      return Promise.all(this.selected.map((s) => this.restartScript(s.script.id, false)));
    }
    public async stopSelected() {
      return Promise.all(this.selected.map((s) => this.stopScript(s.script.id), false));
    }
  }
</script>

<style scoped>

</style>
