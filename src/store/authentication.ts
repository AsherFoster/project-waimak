import {Module, GetterTree, ActionContext, ActionTree, MutationTree} from 'vuex';
import router from '@/router';
import {RootState} from './index';
import {discordAuth, getUser, DiscordUser} from '@/api/discord';

export interface AuthenticationState {
  loggedIn: boolean;
  token: string | null;
  user: DiscordUser | null;
}

export type Context = ActionContext<AuthenticationState, RootState>;
export type OAuth2Provider = 'discord'; // Just in case I want other identity providers

function generateState() {
  return Math.random().toString(36).substr(2);
}

const authentication: Module<AuthenticationState, RootState> = {
  namespaced: true,
  state: {
    loggedIn: false,
    token: null,
    user: null
  } as AuthenticationState,
  mutations: {
    saveUser(state, user: DiscordUser) {
      state.loggedIn = true;
      state.user = user;
    },
    saveToken(state, token: string) {
      state.token = token;
    }
  } as MutationTree<AuthenticationState>,
  getters: {
    avatarUrl(state) {
      if (!state.user) return null;
      return `https://cdn.discordapp.com/avatars/${state.user.id}/${state.user.avatar}.png`;
    }
  } as GetterTree<AuthenticationState, RootState>,
  actions: {
    async initialiseUser(context: Context): Promise<void> {
      const token = localStorage.getItem('auth_access_token');
      if (token) {
        await context.commit('saveToken', token);
        const user = await getUser('@me');
        if (!user) throw new Error('Authentication token is invalid!');
        await context.commit('saveUser', user);
      } else {
        throw new Error('No authorization token!');
      }
    },
    async logout(context: Context): Promise<void> {
      localStorage.removeItem('auth_access_token');
      localStorage.removeItem('auth_expires');
      window.location.href = '/login'; // Not router, to make it reload
    },
    async oAuth2Callback(context: Context): Promise<void> {
      const token = await discordAuth.token.getToken(window.location.href);
      // TODO state checking
      localStorage.setItem('auth_access_token', token.accessToken);
      localStorage.setItem('auth_expires', token.data.expires);
      router.push('/dashboard');
    },
    startOAuth2Flow(context: Context, provider: OAuth2Provider = 'discord'): void {
      const state = generateState();
      localStorage.setItem('oauth2state', state);
      window.location.href = discordAuth.token.getUri({state});
    }
  } as ActionTree<AuthenticationState, RootState>
};

export default authentication;
