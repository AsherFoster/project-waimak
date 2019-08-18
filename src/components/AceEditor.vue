<template>
  <div ref="editor" class="fill-height"></div>
</template>

<script lang="ts">
  import {Component, Emit, Prop, Vue, Watch} from 'vue-property-decorator';
  import * as Ace from 'brace';
  import 'brace/mode/javascript';
  import 'brace/theme/twilight';

  @Component({})
  export default class AceEditor extends Vue {
    @Prop({default: ''}) public value!: string;
    @Prop({default: false}) public disabled!: boolean;

    public editor: Ace.Editor | null = null;
    public async mounted() {
      this.editor = Ace.edit(this.$refs.editor as HTMLElement);
      this.editor.getSession().setMode('ace/mode/javascript');
      this.editor.setTheme('ace/theme/twilight');
      this.editor.setValue(this.value);
      this.editor.clearSelection();
      this.editor.on('change', () => this.editorChange());
    }
    public beforeDestroy() {
      (this.editor as Ace.Editor).destroy();
    }
    @Emit('input')
    public editorChange() {
      return (this.editor as Ace.Editor).getValue();
    }
    @Watch('value')
    public onValueChange(val: string) {
      // When edited, value will be changed, this checks if it is actually different from the editor's value
      // i.e, new data has been loaded
      if (this.editor && this.editor.getValue() !== val) {
        this.editor.setValue(val);
        this.editor.clearSelection();
      }
    }
    @Watch('disabled')
    public onDisabledChange(val: boolean) {
      (this.editor as Ace.Editor).setReadOnly(val);
    }
  }
</script>

<style scoped>

</style>
