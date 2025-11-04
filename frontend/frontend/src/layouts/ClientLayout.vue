<template>
  <div class="client-layout">
    <ClientNavbar @search="handleSearch" />
    <main class="client-main">
      <router-view :search-query="searchQuery" />
    </main>
    <Footer />
  </div>
</template>

<script setup>
import { ref } from 'vue'
import ClientNavbar from '../components/ClientNavbar.vue'
import Footer from '../components/Footer.vue'

const searchQuery = ref('')

const handleSearch = (query) => {
  searchQuery.value = query
}
</script>

<style scoped>
.client-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.client-main {
  flex: 1;
}
</style>