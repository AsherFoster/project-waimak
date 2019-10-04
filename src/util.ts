import {ApolloError} from 'apollo-client';
import {apolloClient} from '@/plugins/apollo';
import gql from 'graphql-tag';

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

export async function checkAuthentication() {
  const token = localStorage.getItem('auth_token');
  if (!token) return;
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
    if (getApolloErrorCode(e) === 'UNAUTHENTICATED') {
      return false;
    } else {
      // TODO this area needs error logging
      // tslint:disable-next-line:no-console
      console.error(e);
      throw new Error('An unknown error occurred during initialisation!');
    }
  }
}
