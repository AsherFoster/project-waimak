import {apolloClient} from '@/plugins/apollo';
import gql from 'graphql-tag';
import * as Sentry from '@sentry/browser';
import {Severity} from '@sentry/browser';

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
