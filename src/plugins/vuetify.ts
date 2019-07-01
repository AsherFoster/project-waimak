import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

import DiscordIcon from '../components/DiscordIcon.vue';

Vue.use(Vuetify, {
  icons: {
    discord: {
      component: DiscordIcon
    }
  }
});
