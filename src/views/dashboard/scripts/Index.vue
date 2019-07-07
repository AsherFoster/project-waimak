<template>
  <v-data-table
          v-if="scripts"
          :headers="tableHeaders"
          :items="scripts.nodes"
          hide-actions
          item-key="id"
  >
    <template v-slot:items="props">
      <tr @click="$router.push('/dashboard/scripts/' + props.item.id)">
        <td>{{props.item.name}}</td>
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
      </tr>
    </template>
  </v-data-table>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import * as moment from 'moment';
  import gql from 'graphql-tag';

  interface ScriptQuery {
    totalCount: number;
    nodes: {
      id: string;
      name: string;
      platform: string;
      updated: Date;
      created: Date;
    }[]
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
    public scripts: ScriptQuery[] = [];
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
  }
</script>

<style scoped>

</style>
