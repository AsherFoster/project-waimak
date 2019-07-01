export interface Bot {
  id: string; // Internal ID
  name: string;
  platform: string;
  created: string;
}

export interface Script {
  id: string;
  name: string;
  body: string;
  platform: string;
  created: Date;
  updated: Date;
}

export interface RunningScript {
  script_id: string;
  started: Date;
}

export function getScriptDetails(scriptId: string): Promise<Script>;
export function getScriptDetails(scriptIds: string[]): Promise<Script[]> {
  return;
}
