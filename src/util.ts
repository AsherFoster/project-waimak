import {apolloClient} from '@/plugins/apollo';
import gql from 'graphql-tag';
import * as Sentry from '@sentry/browser';
import {Severity} from '@sentry/browser';
import store from './store';

export function debounce(func: (...args: any[]) => any, wait: number) {
  let timeout: NodeJS.Timer;
  return function debounced(...args: any[]) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(func, wait, ...args);
  };
}

export function getApolloErrorCode(e: any): string | void {
  // if (!(e instanceof ApolloError)) return;
  // The type guard would be nice, but it stops the following code from working :(
  return e.networkError &&
    e.networkError.result &&
    e.networkError.result.errors &&
    e.networkError.result.errors[0].extensions &&
    e.networkError.result.errors[0].extensions.code;
}

export async function checkAuthentication(): Promise<boolean> {
  const token = localStorage.getItem('auth_token');
  if (!token) return false;
  try {
    const resp = await apolloClient.query({
      query: gql`query CheckAuthentication {
          user {
              id
          }
      }`
    });
    // Initialise if we haven't already
    if (!store.state.auth.loggedIn) await store.dispatch('auth/initialiseUser');
    return true;
  } catch (e) {
    const code = getApolloErrorCode(e);
    if (code === 'UNAUTHENTICATED') {
      localStorage.removeItem('auth_token');
      return false;
    } else {
      Sentry.addBreadcrumb({
        level: Severity.Fatal,
        message: `Failed to check authentication state. Got error: ${code}`,
        data: {code}
      });
      Sentry.captureException(e);
      throw new Error('An unknown error occurred while checking authentication state' + e);
    }
  }
}

export function copy(text: string) {
  const tmp = document.createElement('input');
  tmp.style.position = 'absolute';
  tmp.style.left = '-1000px';
  tmp.style.top = '-1000px';
  tmp.value = text;
  document.body.appendChild(tmp);
  tmp.select();
  document.execCommand('copy');
  document.body.removeChild(tmp);
}
