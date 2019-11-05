<template>
  <v-tooltip right>
    <template v-slot:activator="{ on }">
      <div v-on="on" class="ma-2">
        <div v-if="connected" class="icon" :style="'background: '+ color"></div>
        <v-icon v-else size="medium" class="pulse" :color="color">offline_bolt</v-icon>
      </div>
    </template>
    <span>{{text}}{{since}}</span>
  </v-tooltip>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {ClientState} from '@/graphql/schema-types';
  import moment from 'moment';

  interface Dict {
    [propName: string]: string;
  }
  interface BotConnection {
    state: ClientState;
    created?: Date;
  }

  // These are taken from the discord client, for familiarity
  const statusColors: Dict = {
    OFFLINE: '#ffffff',
    FAILED: '#f04747',
    STARTUP: '#faa61a',
    ONLINE: '#43b581',
    ERROR: '#f04747',
    DEFAULT: '#ffffff'
  };
  const humanStatuses: Dict = {
    OFFLINE: 'Offline',
    FAILED: 'Crashed',
    STARTUP: 'Starting up',
    ONLINE: 'Online',
    ERROR: 'Error',
    DEFAULT: 'Unknown state'
  };

  @Component({})
  export default class StatusIcon extends Vue {
    @Prop({required: true}) public connection!: BotConnection | null;

    get color(): string {
      return statusColors[this.connection ? this.connection.state : 'DEFAULT'];
    }
    get text(): string {
      return humanStatuses[this.connection ? this.connection.state : 'OFFLINE'];
    }
    get since(): string {
      if (this.connection && this.connection.created) {
        return ' (' + moment(this.connection.created).fromNow() + ')';
      } else return '';
    }
    get connected(): boolean {
      return !!this.connection && ['STARTUP', 'ONLINE', 'ERROR'].includes(this.connection.state);
    }
    private cap(str: string) {
      return str[0].toUpperCase() + str.substr(1).toLowerCase();
    }
  }
</script>

<style scoped>
  .icon {
    width: 12px;
    height: 12px;
    border-radius: 6px;
    color: #0F0
  }
  .pulse {
    animation: pulse 3s ease-in-out infinite;
  }
  @keyframes pulse {
    25%, 75% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
</style>
