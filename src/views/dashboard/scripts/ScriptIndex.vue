<template>
  <div>
    <v-text-field
            class="scripts-search my-4"
            :label="`Search ${scripts && scripts.nodes.length} scripts`"
            solo
            append-icon="search"
            hide-details
    ></v-text-field>
    <v-data-table
            v-if="scripts"
            :headers="tableHeaders"
            :items="scripts.nodes"
            hide-actions
            item-key="id"
    >
      <template v-slot:items="props">
        <tr>
          <td>
            <router-link  :to="'/dashboard/scripts/' + props.item.id">
              <a>{{props.item.name}}</a>
            </router-link>
          </td>
          <td>{{props.item.updated | momentnow}}</td>
          <td class="pr-1">
            <v-layout justify-end>
              <v-menu @click.native.stop>
                <v-btn icon slot="activator">
                  <v-icon>more_vert</v-icon>
                </v-btn>
                <v-card>
                  <v-list>
                    <v-list-tile @click="">
                      <v-list-tile-action>
                        <v-icon>refresh</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title>Delete</v-list-tile-title>
                    </v-list-tile>
                    <v-list-tile @click="">
                      <v-list-tile-action>
                        <v-icon>stop</v-icon>
                      </v-list-tile-action>
                      <v-list-tile-title>Stop Everywhere</v-list-tile-title>
                    </v-list-tile>
                  </v-list>
                </v-card>
              </v-menu>
            </v-layout>
          </td>
        </tr>
      </template>
    </v-data-table>
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
  export default class Index extends Vue {
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
    public async deleteScript(script: string) {
      await this.$apollo.mutate({
        mutation: gql`mutation DeleteScript($script: String!) {
  deleteScript(script: $script)
}`,
        variables: {script}
      });
    }
  }
</script>

<style scoped>
  .scripts-search {
    max-width: 600px;
    margin: auto;
  }
</style>
