<template>
  <v-layout>
    <slot />
    <WithTooltip v-if="error && showError" :value="error" :css="'display: flex; align-content: center'">
      <v-icon class="red--text">error</v-icon>
    </WithTooltip>
    <v-icon v-else-if="loading" style="opacity: 0.3">sync</v-icon>
    <v-icon v-else-if="hasSaved" style="opacity: 0.3">check_circle</v-icon>
  </v-layout>
</template>

<script lang="ts">
  import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
  import {debounce} from '@/util';
  import WithTooltip from '@/components/WithTooltip.vue';

  @Component({
    components: {WithTooltip}
  })
  export default class DebouncedInput extends Vue {
    @Prop({required: true})
    public value!: string;

    @Prop({default: 500})
    public time!: number;

    @Prop({default: null})
    public saveFn!: ((v: string) => Promise<void>) | null;

    @Prop({default: ''})
    public error!: string;

    @Prop({default: false})
    public showError!: boolean;

    public loading: boolean = false;
    public hasSaved: boolean = false;

    public debouncedInputChange = debounce(() => this.save(), this.time);
    @Watch('value')
    public onInputChange() {
      this.debouncedInputChange();
    }

    @Emit()
    public save() {
      if (this.saveFn) {
        this.loading = true;
        this.hasSaved = false;
        this.saveFn(this.value).then(() => {
          this.loading = false;
          this.hasSaved = true;
          this.updateError('');
        }).catch((e) => {
          this.loading = false;
          this.updateError(e.toString());
        });
      } else {

      }
      return this.value;
    }

    @Emit('update:error')
    public updateError(e: string) {
      return e;
    }

    @Watch('time')
    public updateDebounce() {
      this.debouncedInputChange = debounce(() => this.save(), this.time);
    }
  }
</script>

<style scoped>

</style>
