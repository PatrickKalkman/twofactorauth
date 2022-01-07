import { createStore } from 'vuex';
import axios from 'axios';

export default createStore({
  state: {},
  mutations: {},
  actions: {
    register({ commit }, credentials) {
      return axios
        .post('//localhost:8090/api/user/register', credentials)
        .then(({ data }) => {
          console.log('user data is:', data);
        });
    },
  },
  modules: {},
});
