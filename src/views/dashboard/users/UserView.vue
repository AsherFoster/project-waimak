<template>
    <div>
        <v-tabs>
            <v-tab :to="tab" v-for="tab in tabs" :key="tab">{{tab}}</v-tab>
        </v-tabs>
        <router-view></router-view>
    </div>
</template>

<script lang="ts">
    import {Component, Vue} from 'vue-property-decorator';

    @Component({})
    export default class UserView extends Vue {
        public tabs = ['list', 'invites'];
    }
</script>

<style scoped>

</style>
