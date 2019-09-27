import {Module, GetterTree, ActionContext, ActionTree, MutationTree} from 'vuex';
import router from '@/router';
import {RootState} from './index';

import {DISCORD_OAUTH_CLIENT_ID} from '@/config';
import {apolloClient} from '@/plugins/apollo';
import gql from 'graphql-tag';
import {ApolloError} from 'apollo-client';
import {getApolloErrorCode} from '@/util';

const AUTH_SCOPES = ['identify', 'email'];
const REDIRECT_URI = 'http://localhost:4000/api/oauth/discord/callback';

export interface User {
  id: string;
  name: string;
  avatarUrl: string;
  email: string;
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

function generateState() {
  return Math.random().toString(36).substr(2);
}

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
      if (token) {
        await context.commit('saveToken', token);
        try {
          const resp = await apolloClient.query({
            query: gql`query GetInitialUser {
                user {
                    id
                    name
                    avatarUrl
                    email
                }
            }`
          });
          context.commit('saveUser', resp.data.user);
        } catch (e) {
          if (getApolloErrorCode(e) === 'UNAUTHENTICATED') {
            await context.dispatch('localLogout');
            throw new Error('Authentication failed');
          } else {
            // TODO this area needs error logging
            // tslint:disable-next-line:no-console
            console.error(e);
            throw new Error('An unknown error occurred during initialisation!');
          }
        }
      } else {
        throw new Error('No authorization token!');
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
    async oAuthComplete(context: Context): Promise<void> {
      const search = window.location.search;
      const query = new URLSearchParams(search);
      if (query.get('error')) {
        context.state.authError = query.get('error');
      } else {
        localStorage.setItem('auth_token', query.get('sess') as string);
        localStorage.setItem('auth_expires',
          // Sets auth_expires to current time plus expiry duration
          new Date(Date.now () + (+(query.get('expires') as string) * 1000)).toISOString()
        );
        // context.state.authComplete = {
        //   isNewUser: query.get('newuser') === 'true',
        //   provider: query.get('provider') as AuthProvider
        // };
        // context.state.token = query.get('sess') as string;
        // context.state.expires = +(query.get('expires') as string);
      }
      router.push('/dashboard');
    },
    startOAuth2Flow(context: Context, provider: AuthProvider = 'DISCORD'): void {
      const state = generateState();
      localStorage.setItem('oauth2state', state);
      const scopes = encodeURIComponent(AUTH_SCOPES.join(' '));
      window.location.href = `https://discordapp.com/api/oauth2/authorize?response_type=code&`
        + `client_id=${DISCORD_OAUTH_CLIENT_ID}&scope=${scopes}&state=${state}`
        + `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`;
    }
  } as ActionTree<AuthenticationState, RootState>
};

export default authentication;
