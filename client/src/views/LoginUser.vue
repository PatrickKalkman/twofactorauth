<template>
  <div>
    <h3>{{ title }}</h3>
    <form v-if="!showTwoFactorPanel" @submit.prevent="login">
      <label for="email"> Email: </label>
      <input v-model="email" type="email" name="email" value />
      <label for="password"> Password: </label>
      <input v-model="password" type="password" name="password" value />
      <button type="submit" name="button">Login</button>
      <p>{{ error }}</p>
      <router-link to="/register">
        Don't have an account? Register.
      </router-link>
    </form>
    <form v-else @submit.prevent="validateToken">
      <label for="token"> Token: </label>
      <input v-model="token" type="text" name="token" value />
      <button type="submit" name="button">Validate</button>
      <p>{{ error }}</p>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      title: 'Login',
      email: '',
      password: '',
      error: '',
      token: '',
      showTwoFactorPanel: false,
    };
  },
  methods: {
    login() {
      this.$store
        .dispatch('login', {
          email: this.email,
          password: this.password,
        })
        .then(() => {
          if (this.$store.state.twofactorenabled) {
            this.showTwoFactorPanel = true;
            this.title = 'Two Factor Authentication';
          } else {
            this.$router.push({ name: 'dashboard' });
          }
        })
        .catch((err) => {
          this.error = err.response.data.message;
        });
    },
    validateToken() {
      this.$store
        .dispatch('validateToken', {
          token: this.token,
        })
        .then(() => {
          if (this.$store.state.twofactorvalidated) {
            this.$router.push({ name: 'dashboard' });
          } else {
            this.error = 'The provided token was not valid, please try again';
          }
        })
        .catch((err) => {
          this.error = err.response.data.message;
        });
    },
  },
};
</script>