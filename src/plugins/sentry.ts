import Vue from 'vue';
import * as Sentry from '@sentry/browser';
import * as Integrations from '@sentry/integrations';

if (process.env.NODE_ENV === 'production') {
  Sentry.init({
    dsn: 'https://42c1e9ceb5e94c84b6e8f3e507598d2d@sentry.io/1779706',
    integrations: [new Integrations.Vue({
      Vue,
      attachProps: true,
      logErrors: true
    })],
  });
}
