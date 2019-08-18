<template>
  <v-tooltip right>
    <template v-slot:activator="{ on }">
      <div v-on="on" class="ma-2">
        <div v-if="connection" class="icon" :style="'background: '+ color"></div>
        <v-icon v-else size="medium" class="pulse" :color="color">offline_bolt</v-icon>
      </div>
    </template>
    <span>{{text}}</span>
  </v-tooltip>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';
  import {ConnectionState} from '@/graphql/schema-types';

  interface Dict {
    [propName: string]: string;
  }
  interface BotConnection {
    state: ConnectionState;
  }

  // These are taken from the discord client, for familiarity
  const statusColors: Dict = {
    OK: '#43b581',
    STARTUP: '#faa61a',
    ERROR: '#f04747',
    DEFAULT: '#ffffff'
  };

  @Component({})
  export default class StatusIcon extends Vue {
    @Prop({required: true}) public connection!: BotConnection | null;

    get color() {
      return statusColors[this.connection ? this.connection.state : 'DEFAULT'];
    }
    get text() {
      return (this.connection ? 'Online' : 'Offline') +
        (this.connection ? ' (' + this.cap(this.connection.state) + ')' : '');
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
