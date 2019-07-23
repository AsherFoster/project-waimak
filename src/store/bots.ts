import {Module, GetterTree, ActionContext, ActionTree, MutationTree} from 'vuex';
import {RootState} from './index';

export interface BotsState {
}

export type Context = ActionContext<BotsState, RootState>;

const bots: Module<BotsState, RootState> = {
  namespaced: true,
  state: {
  } as BotsState,
  mutations: {
  } as MutationTree<BotsState>,
  getters: {
  } as GetterTree<BotsState, RootState>,
  actions: {
  } as ActionTree<BotsState, RootState>
};

export default bots;
