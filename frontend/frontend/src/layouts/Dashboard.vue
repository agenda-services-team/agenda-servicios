<template>
  <div class="dashboard-layout">
    <Sidebar />
    <div class="dashboard-main">
      <div class="dashboard-content">
        <router-view />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store'
import Sidebar from '../components/Sidebar.vue'

const router = useRouter()
const authStore = useAuthStore()

// ✅ VERIFICACIÓN EXTRA DE SEGURIDAD
onMounted(() => {
  // Verificar que sea proveedor
  if (authStore.user?.tipo_usuario !== 'proveedor') {
    console.warn('🚫 Acceso denegado: No es proveedor')
    router.push('/servicios')
    return
  }
  
  // Verificar autenticación
  if (!authStore.isAuthenticated) {
    console.warn('🚫 Acceso denegado: No autenticado')
    router.push('/login')
    return
  }
})
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