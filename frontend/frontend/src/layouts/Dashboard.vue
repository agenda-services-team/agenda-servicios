<template>
    <div class="dashboard-layout">
        <Sidebar />
        <main class="dashboard-content">
            <router-view />
        </main>
    </div>
</template>

<script setup>
import Sidebar from '../components/Sidebar.vue';
</script>

<style scoped>
.dashboard-layout {
    display: flex;
    height: 100vh;
    width: 100%;
    overflow: hidden;
}

.dashboard-content {
    flex: 1;
    background: #fafafa;
    padding: 20px;
    overflow-y: auto;
}
</style>