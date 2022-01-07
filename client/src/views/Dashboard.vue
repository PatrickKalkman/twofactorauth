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
import axios from 'axios';
import CustomerCard from '../components/CustomerCard';

export default {
  components: { CustomerCard },
  data() {
    return {
      isLoading: true,
      customers: [],
    };
  },
  created() {
    axios.get('//localhost:8090/api/customer').then(({ data }) => {
      this.customers = data;
      this.isLoading = false;
    });
  },
};
</script>
