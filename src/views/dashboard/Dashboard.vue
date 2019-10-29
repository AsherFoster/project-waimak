<template>
  <v-app>
<!--     Primary View -->
    <div class="fill-height" v-if="ready">
      <drawer></drawer>
      <v-app-bar dense app :flat="$route.meta.flatToolbar">
        <v-progress-circular v-if="loading" indeterminate size="24" :width="2" color="accent"></v-progress-circular>
        <v-btn v-else icon @click="$router.push('/')">
          <v-icon>home</v-icon>
        </v-btn>
<!--        <v-breadcrumbs :items="breadcrumbs"></v-breadcrumbs>-->
        <v-spacer></v-spacer>
        <a :href="docs">
          <v-icon>help_outline</v-icon>
        </a>
      </v-app-bar>
      <v-content class="fill-height">
        <router-view></router-view>
      </v-content>
    </div>
<!--    Error state -->
    <v-layout v-else-if="error" align-center justify-center column>
      <v-icon size="128">cloud_off</v-icon>
      <h1>Unable to connect :(</h1>
      <v-btn @click="reload">Refresh</v-btn>
    </v-layout>
<!--    Loading state -->
    <v-layout v-else align-center justify-center column>
      <v-progress-circular indeterminate></v-progress-circular>
      <p class="caption">Beep boop, I'm a loading screen</p>
    </v-layout>
  </v-app>
</template>

<script lang="ts">
  import {Component, Vue} from 'vue-property-decorator';
  import Drawer from './Drawer.vue';
  import store from '@/store';
  import {DOCS_URL} from '@/constants';

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
    public breadcrumbs: string[] = [];
    public docs: string = DOCS_URL;

    get loading(): boolean {
      return this.$store.state.loading || this.$apollo.loading;
    }
    // TODO implement breadcrumbs
    // @Watch('$route')
    // public onRouteChange() {
    //   let names = this.$route.matched.slice(1).map(r => {
    //     console.log(r.instances.default);
    //     if(r.instances.default) {
    //       const name = r.instances.default.breadcrumb;
    //       return typeof name === 'string' ? [name] : name || null;
    //     } else {
    //       return r.name || null;
    //     }
    //   }).filter(r => !!r);
    //   this.breadcrumbs = [].concat(...names)
    // }
    public async created() {
      try {
        await store.dispatch('auth/initialiseUser');
        this.ready = true;
      } catch (e) {
        // tslint:disable-next-line:no-console
        console.error('Initialization failed:', e);
        this.error = e;
      }
    }
    public reload() {
      window.location.reload();
    }
  }
</script>
