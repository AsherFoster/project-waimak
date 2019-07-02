export interface Bot {
  id: string; // Internal ID
  name: string;
  platform: string;
  created: string;
}

export enum ScriptState {
  RUNNING,
  LISTENING,
  ERRORED,
  STOPPED
}

export interface RunningScript {
  script_id: string;
  started: Date;
  state: ScriptState;
  autostart: boolean;
}
