import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {
    user: null,
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
  },
  getters: {
    loggedIn(state) {
      return !!state.user;
    },
  },
  modules: {},
});
