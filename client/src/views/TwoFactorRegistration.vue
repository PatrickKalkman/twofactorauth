<template>
  <div>
    <h3>Two Factor Registration</h3>
    <img v-bind:src="qr" />
    <form @submit.prevent="validateToken">
      <label for="token">
        Enter token to enable two factor authentication:
      </label>
      <input v-model="token" type="text" name="token" value />
      <button type="submit" name="button">validate</button>
    </form>
    <p>{{ validationMessage }}</p>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: '',
      error: '',
      twoFactorEnabled: false,
      qr: '',
      token: '',
      validationMessage: '',
    };
  },
  created: function () {
    this.$store
      .dispatch('twoFactorRegisterStep1', {
        email: this.email,
      })
      .then(() => {
        this.qr = this.$store.state.twofactor.qr;
      })
      .catch((err) => {
        this.validationMessage = err;
      });
  },
  methods: {
    validateToken() {
      this.$store
        .dispatch('twoFactorRegisterStep2', {
          base32: this.$store.state.twofactor.secret.base32,
          token: this.token,
        })
        .then(() => {
          if (!this.$store.state.twofactorenabled) {
            this.validationMessage = 'The token was invalid, please try again.';
          } else {
            this.$router.push({ name: 'dashboard' });
          }
        })
        .catch((err) => {
          this.error = err.response.data.message;
        });
    },
  },
};
</script>