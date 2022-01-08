import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    user: null,
    twofactor: null,
    twofactorenabled: false,
  },
  mutations: {
    SET_USER_DATA(state, userData) {
      state.user = userData;
      localStorage.setItem('user', JSON.stringify(userData));
      axios.defaults.headers.common.Authorization = `Bearer ${userData.token}`;
    },
    CLEAR_USER_DATA() {
      localStorage.removeItem('user');
      location.reload();
    },
    SET_TWOFACTOR_DATA(state, twoFactorData) {
      state.twofactor = twoFactorData;
    },
    SET_TWOFACTOR_ENABLED(state, twoFactorEnabled) {
      state.twofactorenabled = twoFactorEnabled;
    },
  },
  actions: {
    register({ commit }, credentials) {
      return axios
        .post('//localhost:8090/api/user/register', credentials)
        .then(({ data }) => {
          commit('SET_USER_DATA', data);
        });
    },
    login({ commit }, credentials) {
      return axios
        .post('//localhost:8090/api/user/login', credentials)
        .then(({ data }) => {
          commit('SET_USER_DATA', data);
        });
    },
    logout({ commit }) {
      commit('CLEAR_USER_DATA');
    },
    twofactorregister({ commit }, credentials) {
      return axios
        .post('//localhost:8090/api/user/enabletwofactorstep1', credentials)
        .then(({ data }) => {
          commit('SET_TWOFACTOR_DATA', data);
        });
    },
    validateToken({ commit }, credentials) {
      return axios
        .post('//localhost:8090/api/user/validatetoken', credentials)
        .then(({ data }) => {
          console.log(data.validated);
          commit('SET_TWOFACTOR_ENABLED', data.validated);
        });
    },
  },
  getters: {
    loggedIn(state) {
      return !!state.user;
    },
    twoFactorEnabled(state) {
      return state.user.twoFactorEnabled;
    },
  },
  modules: {},
});
