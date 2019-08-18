import Vue from 'vue';
import Vuetify from 'vuetify';
import 'vuetify/dist/vuetify.min.css';

import DiscordIcon from '../components/DiscordIcon.vue';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    iconfont: 'md',
    values: {
      discord: {
        component: DiscordIcon
      }
    }
  },
  theme: {
    dark: true
  }
});
