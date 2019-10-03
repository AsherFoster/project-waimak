import Vue from 'vue';
import Router from 'vue-router';
import Dashboard from './views/dashboard/Dashboard.vue';
import {checkAuthentication} from '@/util';

Vue.use(Router);

const flatToolbar = true;

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/dashboard',
    },
    {
      path: '/dashboard',
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
        {path: '*', component: () => import('./views/Error404.vue')}
      ],
      async beforeEnter(to, from, next) {
        if (await checkAuthentication()) {
          next();
        } else {
          // Please, please don't cause a loop
          window.location.href = 'https://api.canal.pointless.me/oauth/discord/start';
        }
      }
    },
    {
      path: '/login',
      component: () => import('./views/auth/Login.vue')
    },
    {
      path: '/auth/callback',
      component: () => import('./views/auth/Callback.vue')
    },
    {
      path: '*',
      component: () => import('./views/Error404.vue')
    }
  ],
});

export default router;
