<template>
  <div>
    <v-layout align-center justify-center>
      <v-text-field
              v-model="searchInput"
              class="scripts-search my-4"
              :label="`Search ${scripts && scripts.nodes.length} scripts`"
              solo
              append-icon="search"
              hide-details
      ></v-text-field>
      <v-btn icon @click="reload">
        <v-icon>refresh</v-icon>
      </v-btn>
    </v-layout>
    <v-data-table
            v-if="searchScripts.length"
            :headers="tableHeaders"
            :items="searchScripts"
            hide-default-footer
            item-key="id"
    >
      <template v-slot:item="{item}">
        <tr>
          <td>
            <router-link  :to="'/scripts/' + item.id">
              {{item.name}}
            </router-link>
          </td>
          <td>{{item.updated || item.created | momentnow}}</td>
          <td class="pr-1">
            <v-layout justify-end>
              <v-menu @click.native.stop>
                <template v-slot:activator="{ on }">
                  <v-btn icon v-on="on">
                    <v-icon>more_vert</v-icon>
                  </v-btn>
                </template>
                <v-card>
                  <v-list>
                    <v-list-item @click="">
                      <v-list-item-action>
                        <v-icon>stop</v-icon>
                      </v-list-item-action>
                      <v-list-item-title>Stop Everywhere (WIP)</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click="deleteScript(item)">
                      <v-list-item-action>
                        <v-icon>delete</v-icon>
                      </v-list-item-action>
                      <v-list-item-title>Delete</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </v-layout>
          </td>
        </tr>
      </template>
    </v-data-table>
    <v-layout v-else align-center justify-center py-6>
      <div v-if="$apollo.loading">Loading</div>
      <div v-else-if="searchInput && !searchScripts.length">No scripts match that search</div>
      <div v-else-if="scripts && !scripts.nodes.length">You don't have any scripts</div>
      <div v-else>Something went wrong!</div>
    </v-layout>
    <v-btn fab @click="createScript" fixed bottom right>
      <v-icon>add</v-icon>
    </v-btn>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import * as moment from 'moment';
  import gql from 'graphql-tag';

  interface Script {
    id: string;
    name: string;
    platform: string;
    updated: Date;
    created: Date;
  }
  interface ScriptQuery {
    totalCount: number;
    nodes: Script[];
  }

  @Component({
    apollo: {
      scripts: gql`query GetAllScripts {
  scripts {
    totalCount
    nodes {
      id
      name
      platform
      updated
      created
    }
  }
}`
    }
  })
  export default class ScriptIndex extends Vue {
    public searchInput: string = '';
    public scripts: ScriptQuery | null = null;
    public readonly tableHeaders = [
      {
        text: 'Name',
        value: 'name'
      },
      {
        text: 'Edited',
        value: 'edited'
      },
      {
        text: '',
        value: 'actions',
        sortable: false
      }
    ];
    public async deleteScript(script: Script) {
      await this.$apollo.mutate({
        mutation: gql`mutation DeleteScript($script: String!) {
  deleteScript(script: $script)
}`,
        variables: {script: script.id}
      });
      const index = (this.scripts as ScriptQuery).nodes.findIndex((s) => s.id === script.id);
      (this.scripts as ScriptQuery).nodes.splice(index, 1);
    }
    public async restartScript(script: Script): Promise<void> {
      await this.$apollo.mutate({
        mutation: gql`mutation RestartScript($script: String!) {
  restartScriptEverywhere(script: $script) {
    bot {
      name
    }
  }
}`,
        variables: {
          script: script.id
        }
      });
    }
    public async createScript() {
      const resp = await this.$apollo.mutate({
        mutation: gql`mutation CreateNewScript {
  createScript {
    id
  }
}`
      });
      this.$router.push('/scripts/' + resp.data.createScript.id);
    }
    public async reload() {
      await this.$apollo.queries.scripts.refetch();
    }
    get searchScripts() {
      if (!this.scripts) return [];
      if (!this.searchInput) return this.scripts.nodes;
      return this.scripts.nodes.filter((s) => s.name.includes(this.searchInput));
    }
  }
</script>

<style scoped>
  .scripts-search {
    max-width: 600px;
  }
</style>
