import {NotImplementedError} from '@/api/common';

function randomDate() {
  return new Date(Date.now() - (Math.random() * 1e6));
}

const USERS: User[] = [
  {
    id: 'id-asher',
    name: 'asher',
    avatar_url: 'https://cdn.discordapp.com/avatars/191698332014346242/5d28178fbc89be9a0deab28f76896f56.png',
    email: 'demo@asherfoster.com',
    created: randomDate(),
    discord_id: '191698332014346242'
  },
  {
    id: 'id-two',
    name: 'asher but not',
    avatar_url: 'https://cdn.discordapp.com/avatars/269783357297131521/80c311e9817186aa764c53bd0800edba.png',
    email: 'demo-2@asherfoster.com',
    created: randomDate(),
    discord_id: '269783357297131521'
  }
];

export class User {
  public readonly name: string;
  public readonly id: string;
  private _avatarUrl?: string | null;
  private _email?: string;
  private _created?: Date;
  public async avatarUrl(): Promise<string | null> {
    // TODO, update for dynamic
    if (this._avatarUrl) return this._avatarUrl;
    else {
      throw new NotImplementedError();
    }
  }
  public async email(): Promise<string> {
    // TODO, update for dynamic
    if (this._email) return this._email;
    else {
      throw new NotImplementedError();
    }
  }
  public async created(): Promise<Date> {
    // TODO, update for dynamic
    if (this._created) return this._created;
    else {
      throw new NotImplementedError();
    }
  }
}

export async function getUser(id: string): Promise<User|null> {
  return USERS.find((u) => u.id === id) || null;
}

export * from './types/user';
