import { createStore } from 'vuex'

export default createStore({
  state: {
    user: null,
    token: null,
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