import {ApolloError} from 'apollo-client';

export function debounce(func: (...args: any[]) => any, wait: number) {
  let timeout: NodeJS.Timer;
  return function debounced(...args: any[]) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(func, wait, ...args);
  };
}

export function getApolloErrorCode(e: ApolloError): string | void {
  if (!(e instanceof ApolloError)) return;
  return e.networkError &&
    e.networkError.result &&
    e.networkError.result.errors &&
    e.networkError.result.errors[0].extensions &&
    e.networkError.result.errors[0].extensions.code;
}
