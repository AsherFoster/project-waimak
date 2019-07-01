import * as ClientOAuth2 from 'client-oauth2';
import {Auth} from '@/config';
import {discordRestRequest} from '@/rest/rest';

export interface User {
  username: string;
  locale: string;
  mfa_enabled: boolean;
  flags: number;
  avatar: string;
  discriminator: string;
  id: string;
}

export const discordAuth = new ClientOAuth2({
  clientId: Auth.discordClientId,
  authorizationUri: 'https://discordapp.com/api/oauth2/authorize',
  redirectUri: window.location.origin + '/auth/discord/callback',
  scopes: ['identify']
});

export async function getUser(id: string): Promise<User> {
  return discordRestRequest<User>({
    endpoint: '/users/' + id
  });
}
