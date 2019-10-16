import Vue from 'vue';
import Router from 'vue-router';
import * as Sentry from '@sentry/browser';
import Dashboard from './views/dashboard/Dashboard.vue';
import {checkAuthentication} from '@/util';
import store from './store';

Vue.use(Router);

const router = new Router({
  mode: 'history',
  base: (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'beta') ? '/app/' : '/',
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
        {path: 'bots', component: () => import('./views/dashboard/bots/BotIndex.vue')},
        {path: 'bots/link', component: () => import('./views/dashboard/bots/BotCreate.vue')},
        {
          path: 'bots/:id',
          component: () => import('./views/dashboard/bots/BotView.vue'),
          children: [
            {path: '', redirect: 'details'},
            {path: 'details', component: () => import('./views/dashboard/bots/BotDetails.vue')},
            {path: 'scripts', component: () => import('./views/dashboard/bots/BotScripts.vue')},
            {path: 'permissions', component: () => import('./views/dashboard/bots/BotPermissions.vue')},
            {path: 'options', component: () => import('./views/dashboard/bots/BotOptions.vue')}
          ]
        },
        {path: 'scripts', component: () => import('./views/dashboard/scripts/ScriptIndex.vue')},
        {path: 'scripts/:id', component: () => import('./views/dashboard/scripts/ScriptDetail.vue')},
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
