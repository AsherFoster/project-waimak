import {Module, GetterTree, ActionContext, ActionTree, MutationTree} from 'vuex';
import {RootState} from './index';

export interface ScriptState {
}

export type Context = ActionContext<ScriptState, RootState>;

const scripts: Module<ScriptState, RootState> = {
  namespaced: true,
  state: {
  } as ScriptState,
  mutations: {
  } as MutationTree<ScriptState>,
  getters: {
  } as GetterTree<ScriptState, RootState>,
  actions: {
    deleteScript() {}
  } as ActionTree<ScriptState, RootState>
};

export default scripts;
