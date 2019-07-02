import {RunningScript} from '@/api/types/bot';
import {Platform} from '@/api/types/common';

interface BotData {
  id: string;
  name: string;
  platform: Platform;
  resource_owner: string
  created: Date
  created_by: User
  connection: BotConnection
  running_scripts: RunningScript[]
}

const BOTS: Bot[] = [
  {
    id: 'id-pointlessbot',
    name: 'Pointless Bot'
  },
  {
    id: 'id-pbdev',
    name: 'Pointless Bot (Dev)'
  }
];

interface BotInit {
  id: string;
  name: string;
}
/*
 * Different helper functions should extend this to declare which properties are available
 * */
export class Bot {
  public id: string;
  public name: string;
  public platform?: Platform;
  public owner?: User;
  public created?: Date;
  public createdBy?: User;
  public connection?: BotConnection;
  public runningScripts?: RunningScript[];
  constructor(initPayload: BotInit) {
    this.id = initPayload.id;
    this.name = initPayload.name;
  }
  public async updateRunningScript(scriptId: string, body: Partial<RunningScript>): Promise<void> {
    return;
  }
}

export async function getBot(id: string): Promise<Bot | null> {
  return BOTS.find(b => b.id === id) || null;
}

export * from './types/bot';
