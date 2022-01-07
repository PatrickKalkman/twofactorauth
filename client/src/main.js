import { createApp, h } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import axios from 'axios';

createApp({
  created() {
    const userString = localStorage.getItem('user');
    if (userString) {
      try {
        const userData = JSON.parse(userString);
        this.$store.commit('SET_USER_DATA', userData);
      } catch (error) {
        this.$store.dispatch('logout');
      }
    }
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response.status === 401) {
          this.$store.dispatch('logout');
        }
        return Promise.reject(error);
      }
    );
  },
  render: () => h(App),
})
  .use(store)
  .use(router)
  .mount('#app');
