<template>
  <v-list>
    <v-list-tile
            v-for="script in scripts"
            :key="script.name"
            @click="$router.push('/dashboard/scripts/' + script.name)"
    >
      <v-list-tile-content>
        <v-list-tile-title>{{script.name}}</v-list-tile-title>
        <v-list-tile-sub-title>{{script.platform}} - Edited {{script.updated | prettyTime}}</v-list-tile-sub-title>
      </v-list-tile-content>
      <v-list-tile-action>
        <v-btn icon>
          <v-icon>more_vert</v-icon>
        </v-btn>
      </v-list-tile-action>
    </v-list-tile>
  </v-list>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import * as moment from 'moment';

  interface Script {
    name: string;
    code: string;
    platform: string;
    updated: Date;
    created: Date;
  }

  @Component({
    filters: {
      prettyTime(time: Date): string {
        return moment(time).fromNow();
      }
    }
  })
  export default class Index extends Vue {
    scripts: Script[] = [
      {
        name: 'AutoPin',
        code: 'if(diamonded)\npin()',
        platform: 'nodejs',
        updated: new Date(),
        created: new Date()
      },
      {
        name: 'Tags',
        code: 'if(diamonded)\npin()',
        platform: 'nodejs',
        updated: new Date(),
        created: new Date()
      },
      {
        name: 'Things',
        code: 'if(diamonded)\npin()',
        platform: 'nodejs',
        updated: new Date(),
        created: new Date()
      }
    ];
  }
</script>

<style scoped>

</style>
