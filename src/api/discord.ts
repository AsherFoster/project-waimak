import * as ClientOAuth2 from 'client-oauth2';
import {DISCORD_OAUTH_CLIENT_ID, DISCORD_API_BASE} from '@/config';
import store from '@/store';

export type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' | 'UPDATE';
export interface Headers {
  [headerName: string]: string;
}

export interface DiscordUser {
  username: string;
  locale: string;
  mfa_enabled: boolean;
  flags: number;
  avatar: string;
  discriminator: string;
  id: string;
}

export const discordAuth = new ClientOAuth2({
  clientId: DISCORD_OAUTH_CLIENT_ID,
  authorizationUri: 'https://discordapp.com/api/oauth2/authorize',
  redirectUri: window.location.origin + '/auth/discord/callback',
  scopes: ['identify']
});

export async function getUser(id: string): Promise<DiscordUser> {
  return discordRestRequest<DiscordUser>({
    endpoint: '/users/' + id
  });
}

export interface DiscordRestOptions {
  method?: HttpMethod;
  endpoint: string;
  payload?: any;
  mimeType?: string;
}
export async function discordRestRequest<T>({
  method = 'GET',
  endpoint, payload, mimeType
}: DiscordRestOptions): Promise<T> {
  const headers: Headers = {
    Authorization: 'Bearer ' + store.state.auth.token,
  };
  if (payload) {
    headers['Content-Type'] = mimeType || 'application/json';
  }
  const url = DISCORD_API_BASE + endpoint;
  const r = await fetch(url, {
    method,
    body: payload ? JSON.stringify(payload) : undefined,
    headers
  });
  const body = await r.json();
  if (!r.ok) throw new Error(`[Error ${body.code}] ${body.message}`);
  return body;
}
