import { createStore } from 'vuex';
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8090/api/',
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
});

export default createStore({
  state: {
    user: null,
    twofactor: null,
    twofactorenabled: false,
    twofactorvalidated: false,
    customers: [],
  },
  mutations: {
    SET_USER_DATA(state, userData) {
      state.user = userData;
      state.twofactorenabled = userData.twoFactorEnabled;
      localStorage.setItem('user', JSON.stringify(userData));
      apiClient.defaults.headers.common.Authorization = `Bearer ${userData.token}`;
    },
    CLEAR_USER_DATA() {
      localStorage.removeItem('user');
    },
    SET_TWOFACTOR_DATA(state, twoFactorData) {
      state.twofactor = twoFactorData;
    },
    SET_TWOFACTOR_ENABLED(state, twoFactorEnabled) {
      state.twofactorenabled = twoFactorEnabled;
    },
    SET_TWOFACTOR_LOGIN(state, validated) {
      state.twofactorvalidated = validated;
    },
    SET_CUSTOMERS(state, customerData) {
      state.customers = customerData;
    },
  },
  actions: {
    register({ commit }, credentials) {
      return apiClient.post('/user/register', credentials).then(({ data }) => {
        commit('SET_USER_DATA', data);
      });
    },
    login({ commit }, credentials) {
      return apiClient.post('/user/login', credentials).then(({ data }) => {
        commit('SET_USER_DATA', data);
      });
    },
    logout({ commit }) {
      commit('CLEAR_USER_DATA');
    },
    twoFactorRegisterStep1({ commit }, credentials) {
      return apiClient
        .post('/user/enabletwofactorstep1', credentials)
        .then(({ data }) => {
          commit('SET_TWOFACTOR_DATA', data);
        });
    },
    twoFactorRegisterStep2({ commit }, credentials) {
      return apiClient
        .post('/user/enabletwofactorstep2', credentials)
        .then(({ data }) => {
          commit('SET_TWOFACTOR_ENABLED', data);
        });
    },
    validateToken({ commit }, credentials) {
      return apiClient
        .post('/user/validatetoken', credentials)
        .then(({ data }) => {
          commit('SET_TWOFACTOR_LOGIN', data.validated);
        });
    },
    getCustomers({ commit }) {
      return apiClient.get('/customer').then(({ data }) => {
        commit('SET_CUSTOMERS', data);
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
