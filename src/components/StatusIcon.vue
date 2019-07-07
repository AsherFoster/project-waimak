<template>
  <v-tooltip right>
    <div slot="activator" class="ma-2">
      <div v-if="online" class="icon" :style="'background: '+ color"></div>
      <v-icon v-else size="medium" class="pulse" :color="mode !== 'ok' && color">offline_bolt</v-icon>
    </div>
    <span>{{text}}</span>
  </v-tooltip>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  interface Dict {
    [propName: string]: string;
  }

  // These are taken from the discord client, for familiarity
  const statusColors: Dict = {
    OK: '#43b581',
    STARTUP: '#faa61a',
    ERROR: '#f04747',
  };

  @Component({})
  export default class StatusIcon extends Vue {
    @Prop({required: true}) public mode!: string;
    @Prop({default: true}) public online!: boolean;

    get color() {
      return statusColors[this.mode];
    }
    get text() {
      return (this.online ? 'Online' : 'Offline') + ' (' + this.mode + ')';
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
