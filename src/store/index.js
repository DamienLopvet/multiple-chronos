import { createStore } from 'vuex'

export default createStore({
  state: {
    user: undefined,
    token: undefined,
    isLogged:false,
  },
  mutations: {
    setUser(state, user) {
      state.user = user;
    },
    setToken(state, token) {
      state.token = token;
    },
    setIsLogged(state, isLogged){
      state.isLogged = isLogged
    }
  },
  actions: {},
  getters: {},
});