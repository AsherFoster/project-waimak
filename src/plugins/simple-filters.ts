import * as moment from 'moment';
import Vue from 'vue';

Vue.filter('momentnow', (v: Date, hideSuffix?: boolean) => {
  return moment(v).fromNow(hideSuffix);
});
