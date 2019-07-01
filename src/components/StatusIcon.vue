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

  type Dict = {[propName: string]: string};

  // These are taken from the discord client, for familiarity
  const statusColors: Dict = {
    ok: '#43b581',
    startup: '#faa61a',
    error: '#f04747',
  };

  @Component({})
  export default class StatusIcon extends Vue {
    @Prop({required: true}) mode!: string;
    @Prop({default: true}) online!: boolean;

    get color() {
      return statusColors[this.mode];
    }
    get text() {
      return (this.online ? 'Online' : 'Offline') + ' (' + this.mode + ')'
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
