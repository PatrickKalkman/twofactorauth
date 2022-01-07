<template>
  <div>
    <form @submit.prevent="register">
      <label for="email"> Email: </label>
      <input v-model="email" type="email" name="email" value />

      <label for="password"> Password: </label>
      <input v-model="password" type="password" name value />

      <button type="submit" name="button">Register</button>
    </form>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      password: '',
    };
  },
  methods: {
    register() {
      this.$store.dispatch('register', {
        email: this.email,
        password: this.password,
      });
    },
  },
};
</script>

<style lang="scss" scoped>
</style>