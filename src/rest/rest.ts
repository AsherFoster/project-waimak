import {DISCORD_API_BASE} from '@/config';
import store from '../store';

export type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PUT' | 'PATCH' | 'UPDATE';
export interface Headers {
  [headerName: string]: string;
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
