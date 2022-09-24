import { createStore } from 'vuex'

export default createStore({
  state: {
    user: undefined,
    token: undefined,
    isLogged:false,
    darkTheme:null,
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
    },
    setDarkTheme(state, darkTheme){
      state.darkTheme = darkTheme
    }
  },
  actions: {},
  getters: {},
});