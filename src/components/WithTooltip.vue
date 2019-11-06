<template>
  <v-tooltip
          :left="position === 'left'"
          :right="position === 'right'"
          :top="position === 'top'"
          :bottom="position === 'bottom'">
    <template v-slot:activator="{ on }">
      <div v-on="on" :style="css">
        <slot></slot>
      </div>
    </template>
    <span>{{value}}</span>
  </v-tooltip>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({})
  export default class WithTooltip extends Vue {
    @Prop({required: true}) public value!: string;
    @Prop({default: ''}) public css!: string;
    @Prop({default: 'bottom'}) public position!: string;
  }
</script>

<style scoped>

</style>
