<template>
    <v-tooltip top>
        <template v-slot:activator="{ on }">
            <v-icon class="badge" v-on="on">security</v-icon>
        </template>
        <span>Administrator</span>
    </v-tooltip>
</template>

<script>
    import {Component, Vue} from 'vue-property-decorator';

    @Component({})
    export default class AdministratorBadge extends Vue {}
</script>

<style scoped>
    .badge {
        font-size: 16px;
        opacity: 0.8;
    }
</style>
