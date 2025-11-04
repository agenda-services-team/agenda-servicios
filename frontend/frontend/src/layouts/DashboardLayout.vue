<template>
    <div class="dashboard-layout">
        <Sidebar />

        <div class="dashboard-main">
            <ClientNavbar /> <!-- Aquí va el header con usuario, buscador, etc -->
            <main class="dashboard-content">
                <router-view />
            </main>
        </div>
    </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue'
import ClientNavbar from '../components/ClientNavbar.vue'
</script>

<style scoped>
.dashboard-layout {
    display: flex;
    min-height: 100vh;
    background-color: #f9fafb;
}

.dashboard-main {
    flex: 1;
    display: flex;
    flex-direction: column;
}

.dashboard-content {
    flex: 1;
    padding: 1.5rem;
    overflow-y: auto;
}
</style>
