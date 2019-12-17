import Vue from 'vue';
import Router from 'vue-router';
import * as Sentry from '@sentry/browser';
import Dashboard from './views/dashboard/Dashboard.vue';
import {checkAuthentication} from '@/util';
import store from './store';
import {apolloClient} from '@/plugins/apollo';
import gql from 'graphql-tag';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/login',
      component: () => import('./views/auth/Login.vue')
    },
    {
      path: '/auth/callback',
      component: () => import('./views/auth/Callback.vue')
    },
    {
      path: '/error',
      component: () => import('./views/Error.vue')
    },
    {
      path: '/',
      component: Dashboard,
      children: [
        {path: '', component: () => import('./views/dashboard/Home.vue')},
        {path: 'debug', component: () => import('./views/dashboard/Debug.vue')},
        {path: 'about', component: () => import('./views/dashboard/About.vue')},
        {path: 'bots', redirect: '/'},
        {path: 'bots/link', component: () => import('./views/dashboard/bots/BotCreate.vue')},
        {
          path: 'bots/:id',
          component: () => import('./views/dashboard/bots/BotView.vue'),
          children: [
            {path: '', redirect: 'info'},
            {path: 'info', component: () => import('./views/dashboard/bots/BotDetails.vue')},
            {path: 'options', component: () => import('./views/dashboard/bots/BotOptions.vue')}
          ]
        },
        {
          path: 'workspaces',
          redirect() {
            if (!store.state.auth.user || !store.state.auth.user.id) {
              console.error('Grrr, a guard didn\'t work properly or something', store.state.auth.user);
              return '/error';
            }
            return 'workspaces/' + store.state.auth.user.id + '/modules';
          }
        },
        {path: 'workspaces/:workspace/modules', component: () => import('./views/dashboard/workspaces/modules/ModuleIndex.vue')},
        {path: 'workspaces/:workspace/modules/:id', component: () => import('./views/dashboard/workspaces/modules/ModuleDetail.vue')},
        {path: 'workspaces/:workspace', redirect: (to) => 'workspaces/' + to.params.workspace + '/modules'},
        {path: 'settings', component: () => import('./views/dashboard/settings/SettingsView.vue')},
        {path: 'settings/deleteaccount', component: () => import('./views/dashboard/settings/DeleteAccount.vue')},
        {
          path: 'users',
          component: () => import('./views/dashboard/users/UserView.vue'),
          children: [
            {path: '', redirect: 'list'},
            {path: 'list', component: () => import('./views/dashboard/users/UserList.vue')},
            {path: 'invites', component: () => import('./views/dashboard/users/Invites.vue')}
          ],
          async beforeEnter(to, from, next) {
            if (store.state.auth.user && store.state.auth.user.admin) next();
            else next('/');
          }
        },
        {path: '*', component: () => import('./views/Error404.vue')}
      ],
      async beforeEnter(to, from, next) {
        try {
          if (await checkAuthentication()) {
            next();
          } else {
            next('/login');
          }
        } catch (e) {
          next(e);
        }
      }
    },
    // Stuff won't be matched below here, dashboard's "/" captures everything
    {
      path: '*',
      component: () => import('./views/Error404.vue')
    }
  ],
});

router.onError((e: Error) => {
  Sentry.captureException(e);
  router.push('/error');
});

export default router;
