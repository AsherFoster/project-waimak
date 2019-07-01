<template>
  <div>
    <v-toolbar dense>
      <span v-if="selected.length">{{selected.length}} scripts selected</span>
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
            :items="scripts"
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
        <td>{{props.item.name}}</td>
        <td>{{props.item.started}}</td>
        <td class="justify-end layout">
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
        </td>
      </template>
    </v-data-table>
  </div>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import * as moment from 'moment';

  @Component({})
  export default class BotScripts extends Vue {
    public scripts = [
      {
        name: 'Autopin',
        started: moment(new Date()).fromNow()
      },
      {
        name: 'FuckYourArmour',
        started: moment(new Date()).fromNow()
      },
      {
        name: 'Tags',
        started: moment(new Date()).fromNow()
      }
    ];
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
