<template>
    <v-tooltip top>
        <template v-slot:activator="{ on }">
            <v-icon :style="{opacity}" :size="size" v-on="on">security</v-icon>
        </template>
        <span>Administrator</span>
    </v-tooltip>
</template>

<script lang="ts">
  import {Component, Prop, Vue} from 'vue-property-decorator';

  @Component({})
  export default class AdministratorBadge extends Vue {
    @Prop({default: 16})
    public size!: number;

    @Prop({default: 1})
    public opacity!: number;
  }
</script>

<style scoped>
    .badge {
        font-size: 16px;
        opacity: 0.8;
    }
</style>
