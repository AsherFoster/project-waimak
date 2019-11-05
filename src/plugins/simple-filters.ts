import * as moment from 'moment';
import Vue from 'vue';

Vue.filter('cMomentNow', (v: Date, hideSuffix?: boolean) => {
  return v ? moment(v).fromNow(hideSuffix) : 'never';
});

Vue.filter('cScriptState', (v: string | null) => {
  const dict: any = {
    STOPPED: 'Stopped',
    RUNNING: 'Running',
    PASSIVE: 'Listening',
    ERROR: 'Error',
    DEFAULT: 'Unknown state'
  };
  return dict[v || 'DEFAULT'];
});
