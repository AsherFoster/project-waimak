<template>
  <div>
    <v-toolbar dense>
      <span v-if="selected.length">{{selected.length}} script{{selected.length > 1 ? 's' : ''}} selected</span>
      <v-spacer></v-spacer>
      <v-btn icon :disabled="!selected.length">
        <v-icon>refresh</v-icon>
      </v-btn>
      <v-btn icon :disabled="!selected.length">
        <v-icon>stop</v-icon>
      </v-btn>
    </v-toolbar>
    <v-data-table
            :headers="tableHeaders"
            :items="bot.runningScripts"
            select-all
            v-model="selected"
            hide-actions
            item-key="name"
    >
      <template v-slot:items="props">
        <!-- Quick and dirty shrink. TODO tidy -->
        <td style="width: 0">
          <v-checkbox v-model="props.selected" primary hide-details></v-checkbox>
        </td>
        <td>{{props.item.script.name}}</td>
        <td>{{props.item.started | momentnow}}</td>
        <td class="pr-1">
          <v-layout justify-end>
            <v-tooltip top>
              <v-btn icon slot="activator" @click="props.item.autostart = !props.item.autostart">
                <v-icon>{{props.item.autostart ? 'star' : 'star_border'}}</v-icon>
              </v-btn>
              {{props.item.autostart ? 'Disable' : 'Enable'}} Autostart
            </v-tooltip>
            <v-menu>
                <v-btn icon slot="activator">
                  <v-icon>more_vert</v-icon>
                </v-btn>
                <v-card>
                  <v-list>
                    <v-list-tile @click="">
                      <v-list-tile-action>
                        <v-icon>refresh</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title>Restart</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="">
                      <v-list-tile-action>
                        <v-icon>stop</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title>Stop</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="">
                      <v-list-tile-action>
                        <v-icon>info</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title>Details</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-card>
              </v-menu>
          </v-layout>
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import gql from 'graphql-tag';

  interface RunningScript {
    script: {
      id: string;
      name: string;
    };
    autostart: boolean;
  }
  interface BotQuery {
    runningScripts: RunningScript[];
  }

  @Component({
    apollo: {
      bot() {
        return {
          query: gql`query GetScriptsForBot($id: String!) {
  bot(id: $id) {
    runningScripts {
      script {
        id
        name
      }
      started
      autostart
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
  export default class BotScripts extends Vue {
    public bot: BotQuery = {
      runningScripts: []
    };
    public readonly tableHeaders = [
      {
        text: 'Name',
        value: 'name'
      },
      {
        text: 'Started',
        value: 'started'
      },
      {
        text: '',
        value: 'actions',
        sortable: false
      }
    ];
    public selected = [];
  }
</script>

<style scoped>

</style>
