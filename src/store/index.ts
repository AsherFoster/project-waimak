import vuex, {StoreOptions} from 'vuex';
import authentication, {AuthenticationState} from '@/store/authentication';

export interface RootState {
  loading: boolean;
}
interface ModuleStates {
  auth: AuthenticationState;
}

const store: StoreOptions<RootState> = {
  strict: process.env.NODE_ENV !== 'production',
  state: {
    loading: false
  },
  mutations: {
    setLoading(state, loading) {
      state.loading = loading;
    }
  },
  modules: {
    auth: authentication
  }
};

// Terrible, but I think it's the best way of doing it
// Seriously, if you know a better way, tell me
export default new vuex.Store<RootState & ModuleStates>(store as any);
