<template>
  <v-btn icon @click="copy()">
    <v-icon small>file_copy</v-icon>
  </v-btn>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';

  @Component({
    props: ['value']
  })
  export default class CopyText extends Vue {
    public copy() {
      const tmp = document.createElement('input');
      tmp.style.position = 'absolute';
      tmp.style.left = '-1000px';
      tmp.style.top = '-1000px';
      tmp.value = this.$props.value;
      document.body.appendChild(tmp);
      tmp.select();
      document.execCommand('copy');
      document.body.removeChild(tmp);
    }
  }
</script>

<style scoped>

</style>
