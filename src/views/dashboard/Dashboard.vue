<template>
  <v-app dark>
<!--     Primary View -->
    <div class="fill-height" v-if="ready">
      <drawer></drawer>
      <v-toolbar dense app :flat="$route.meta.flatToolbar">
        <v-progress-circular v-if="loading" indeterminate size="24" :width="2" color="accent"></v-progress-circular>
        <v-btn v-else icon @click="$router.push('/')">
          <v-icon>home</v-icon>
        </v-btn>
        <v-breadcrumbs :items="breadcrumbs">
<!--          TODO: Fix the breadcrumb display -->
  <!--        <v-breadcrumbs-item-->
  <!--                v-for="(item, i) in $route.path.split('/').slice(2)"-->
  <!--                :key="item"-->
  <!--                exact-->
  <!--                :to="$route.path.split('/').slice(0, i + 2).join('/')"-->
  <!--        >{{item | capitalize}}</v-breadcrumbs-item>-->
        </v-breadcrumbs>
        <v-spacer></v-spacer>
      </v-toolbar>
      <v-content class="fill-height">
        <router-view></router-view>
      </v-content>
    </div>
<!--    Error state -->
    <v-layout v-else-if="error" align-center justify-center>
      <i class="material-icons">cloud_off</i>
      <h1>Unable to connect to API</h1>
      <button class="retry" @click="retryConnect">Retry</button>
    </v-layout>
<!--    Loading state -->
    <v-layout v-else align-center justify-center column>
      <v-progress-circular indeterminate></v-progress-circular>
      <p class="caption">Beep boop, I'm a loading screen</p>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
  import { Component, Vue } from 'vue-property-decorator';
  import Drawer from './Drawer.vue';
  import store from '@/store';
  import {State} from 'vuex-class';

  @Component({
    components: {Drawer},
    filters: {
      capitalize(value: string) {
        if (!value) return '';
        return value.charAt(0).toUpperCase() + value.slice(1);
      }
    }
  })
  export default class DashboardWrapper extends Vue {
    public ready: boolean = false;
    public error: Error|null = null;
    @State('loading') public loading!: boolean;

    get breadcrumbs(): any[] {
      return this.$route.path.split('/').slice(2).map((text) => ({text}));
    }
    public async created() {
      try {
        await store.dispatch('auth/initialiseUser');
        this.ready = true;
      } catch (e) {
        console.error('Initialization failed:', e);
        this.$router.push('/login');
      }
    }
  }
</script>
