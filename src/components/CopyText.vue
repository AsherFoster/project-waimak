<template>
  <v-btn icon @click="copy()">
    <v-icon small>file_copy</v-icon>
  </v-btn>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import {copy} from '@/util';

  @Component({
    props: ['value']
  })
  export default class CopyText extends Vue {
    public copy() {
      copy(this.$props.value)
    }
  }
</script>

<style scoped>

</style>
