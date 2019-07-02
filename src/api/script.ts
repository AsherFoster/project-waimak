import {Script} from '@/api/types/script';
import {randomDate} from '@/api/common';

const SCRIPTS: Script[] = [
  {
    id: 'id-autopin',
    name: 'Autopin',
    body: 'if(diamonded) pin()',
    platform: 'nodejs',
    created: randomDate(),
    updated: randomDate()
  },
  {
    id: 'id-fya',
    name: 'FuckYourArmour',
    body: 'if(armour) scream()',
    platform: 'nodejs',
    created: randomDate(),
    updated: randomDate()
  },
  {
    id: 'id-tags',
    name: 'Tags',
    body: 'on(message, () => sendTag())',
    platform: 'nodejs',
    created: randomDate(),
    updated: randomDate()
  }
];

// Woohoo, finally, an excuse to use overloads!
export function getScriptDetails(ids: string): Promise<Script | null>;
export function getScriptDetails(ids: string[]): Promise<(Script | null)[]>;
export function getScriptDetails(ids: any): Promise<any> {
  if (Array.isArray(ids)) {
    return Promise.all(ids.map((i) => _getScript(i)));
  } else {
    return _getScript(ids);
  }
}

async function _getScript(scriptId: string): Promise<Script | null> {
  return SCRIPTS.find((s) => s.id === scriptId) || null;
}

export * from './types/script';
