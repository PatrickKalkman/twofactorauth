<template>
  <div>
    <h3>Register user</h3>
    <form @submit.prevent="register">
      <label for="email"> Email: </label>
      <input v-model="email" type="email" name="email" value />

      <label for="password"> Password: </label>
      <input v-model="password" type="password" name value />

      <button type="submit" name="button">Register</button>
      <p>{{ error }}</p>
      <router-link to="/login"> Already have an account? Login. </router-link>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
      error: '',
      twoFactorEnabled: false,
    };
  },
  methods: {
    register() {
      this.$store
        .dispatch('register', {
          email: this.email,
          password: this.password,
        })
        .then(() => {
          this.$router.push({ name: 'dashboard' });
        })
        .catch((err) => {
          this.error = err.response.data.message;
        });
    },
  },
};
</script>