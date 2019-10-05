import {Module, GetterTree, ActionContext, ActionTree, MutationTree} from 'vuex';
import router from '@/router';
import {RootState} from './index';

import {apolloClient} from '@/plugins/apollo';
import gql from 'graphql-tag';
import {getApolloErrorCode} from '@/util';

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
  admin: boolean;
}
export interface AuthenticationState {
  loggedIn: boolean;
  token: string | null;
  user: User | null;
  authError: string | null;
  authComplete: AuthCompletionData | null;
}
export interface AuthCompletionData {
  isNewUser: boolean;
  provider: AuthProvider;
}

export type Context = ActionContext<AuthenticationState, RootState>;
export type AuthProvider = 'DISCORD'; // Just in case I want other identity providers

const authentication: Module<AuthenticationState, RootState> = {
  namespaced: true,
  state: {
    loggedIn: false,
    token: null,
    user: null,
    authError: null,
    authComplete: null
  } as AuthenticationState,
  mutations: {
    saveUser(state, user: User) {
      state.loggedIn = true;
      state.user = user;
    },
    saveToken(state, token: string) {
      state.token = token;
    }
  } as MutationTree<AuthenticationState>,
  getters: {
    avatarUrl(state): string | null {
      if (!state.user) return null;
      return state.user.avatarUrl;
    }
  } as GetterTree<AuthenticationState, RootState>,
  actions: {
    async initialiseUser(context: Context): Promise<void> {
      const token = localStorage.getItem('auth_token');
      if (!token) throw new Error('Dashboard auth guard has been bypassed? Wtf? (no token)');

      await context.commit('saveToken', token);
      try {
        const resp = await apolloClient.query({
          query: gql`query GetInitialUser {
              user {
                id
                name
                avatarUrl
                email
                admin
              }
          }`
        });
        context.commit('saveUser', resp.data.user);
      } catch (e) {
        if (getApolloErrorCode(e) === 'UNAUTHENTICATED') {
          await context.dispatch('localLogout');
          throw new Error('Dashboard auth guard has been bypassed? Wtf? (auth failed)');
        } else {
          // TODO this area needs error logging
          // tslint:disable-next-line:no-console
          console.error(e);
          throw new Error('An unknown error occurred during initialisation!');
        }
      }
    },
    async logout(context: Context): Promise<void> {
      apolloClient.mutate({
        mutation: gql`mutation LogoutUser {
            destroySession
        }`
      }).finally(() => {
        // Destroy local data regardless of server state
        context.dispatch('localLogout');
      });
    },
    localLogout(context: Context): void {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('auth_expires');
      window.location.href = '/login'; // Not router, to make it reload
    },
  } as ActionTree<AuthenticationState, RootState>
};

export default authentication;
