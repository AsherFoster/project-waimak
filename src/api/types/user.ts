export interface DiscordUser {
  username: string;
  locale: string;
  mfa_enabled: boolean;
  flags: number;
  avatar: string;
  discriminator: string;
  id: string;
}

export interface User {
  name: string;
  id: string; // Discord-independent ID
  avatar_url: string | null;
  email: string;
  created: Date;
  discord_id: string | null; // If using discord oauth
}
