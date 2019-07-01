import '@babel/polyfill';
import Vue from 'vue';
import {sync} from 'vuex-router-sync';

import '@/plugins/vuetify';
import '@/plugins/vuex';
import '@/plugins/register-hooks';

import App from '@/App.vue';
import store from '@/store/index';
import router from '@/router';

Vue.config.productionTip = false;

sync(store, router);

new Vue({
  router,
  render: (h) => h(App),
  store
}).$mount('#app');
