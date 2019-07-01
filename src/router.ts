import Vue from 'vue';
import Router from 'vue-router';

// Dashboard
import Dashboard from './views/dashboard/Dashboard.vue';
import Home from './views/dashboard/Home.vue';

Vue.use(Router);

const flatToolbar = true;

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      redirect: '/dashboard'
    },
    {
      path: '/dashboard',
      component: Dashboard,
      children: [
        {path: '', component: Home},
        {path: 'debug', component: () => import('./views/dashboard/Debug.vue')},
        {path: 'about', component: () => import('./views/dashboard/About.vue')},
        {path: 'bots', component: () => import('./views/dashboard/bots/BotIndex.vue')},
        {
          path: 'bots/:id',
          component: () => import('./views/dashboard/bots/BotView.vue'),
          children: [
            {path: '', redirect: 'details'},
            {path: 'details', component: () => import('./views/dashboard/bots/BotDetails.vue')},
            {path: 'scripts', component: () => import('./views/dashboard/bots/BotScripts.vue')}
          ]
        },
        {path: 'scripts', component: () => import('./views/dashboard/scripts/Index.vue')},
        {path: 'scripts/:id', component: () => import('./views/dashboard/scripts/Detail.vue')},
        {path: '*', component: () => import('./views/Error404.vue')}
      ]
    },
    {
      path: '/login',
      component: () => import('./views/auth/Login.vue')
    },
    {
      path: '/auth/:provider/callback',
      component: () => import('./views/auth/Callback.vue')
    },
    {
      path: '*',
      component: () => import('./views/Error404.vue')
    }
  ],
});

export default router;
