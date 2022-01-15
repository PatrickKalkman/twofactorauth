<template>
  <div>
    <h1>Dashboard</h1>
    <template v-if="!isLoading">
      <CustomerCard
        v-for="customer in customers"
        :key="customer.id"
        :customer="customer"
      />
    </template>
    <p v-else>Loading customers</p>
  </div>
</template>

<script>
import CustomerCard from '@/components/CustomerCard';

export default {
  components: { CustomerCard },
  data() {
    return {
      isLoading: true,
      customers: [],
    };
  },
  created() {
    this.$store
      .dispatch('getCustomers')
      .then(() => {
        this.isLoading = false;
        this.customers = this.$store.state.customers;
      })
      .catch((err) => {
        this.isLoading = false;
        console.log(err);
      });
  },
};
</script>
