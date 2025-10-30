<template>
    <aside class="sidebar">
        <div class="user-info">
            <img src="../assets/logo.png" alt="Logo" class="logo" />
            <p>{{ userName }}</p>
            <small class="user-role">{{ userRole }}</small>
        </div>
        <nav class="menu">
            <router-link to="/dashboard" class="menu-item" exact-active-class="router-link-active">
                <i class="icon">🏠</i> Inicio
            </router-link>
            <router-link to="/dashboard/agenda" class="menu-item">
                <i class="icon">📅</i> Agenda
            </router-link>
            <router-link to="/dashboard/servicios" class="menu-item">
                <i class="icon">💇</i> Servicios
            </router-link>
            <router-link to="/dashboard/galeria" class="menu-item">
                <i class="icon">🖼️</i> Galería
            </router-link>
            <router-link to="/dashboard/configuracion" class="menu-item">
                <i class="icon">⚙️</i> Configuración
            </router-link>
            <router-link to="/dashboard/perfil" class="menu-item">
                <i class="icon">👤</i> Mi Perfil
            </router-link>
            <button @click="cerrarSesion" class="menu-item logout-btn">
                <i class="icon">🚪</i> Cerrar Sesión
            </button>
        </nav>
    </aside>
</template>

<script>
import { useAuthStore } from '../store';
import { useRouter } from 'vue-router';
import { computed } from 'vue';

export default {
  name: 'Sidebar',
  setup() {
    const authStore = useAuthStore();
    const router = useRouter();
    
    // ✅ VERIFICAR QUE SEA PROVEEDOR AL MONTAR EL COMPONENTE
    if (authStore.user?.tipo_usuario !== 'proveedor') {
        console.warn('⚠️ Cliente en sidebar de proveedor, redirigiendo...');
        router.push('/servicios');
    }
    
    const cerrarSesion = () => {
      authStore.logout();
      router.push('/login');
    };

    const userName = computed(() => authStore.user?.nombre || localStorage.getItem('nombre') || 'Usuario');
    const userRole = computed(() => {
        const tipo = authStore.user?.tipo_usuario;
        return tipo === 'proveedor' ? 'Proveedor' : 'Cliente';
    });

    return {
      cerrarSesion,
      userName,
      userRole
    }
  }
}
</script>

<style scoped>
.sidebar {
    width: 230px;
    background-color: #f3eaff;
    height: 100vh;
    padding: 20px;
    display: flex;
    flex-direction: column;
}

.user-info {
    text-align: center;
    margin-bottom: 40px;
}

.logo {
    max-width: 100px;
}

.user-role {
    display: block;
    color: #791236;
    font-weight: bold;
    margin-top: 5px;
}

.menu-item {
    display: block;
    padding: 10px 0;
    color: #333;
    text-decoration: none;
}

.menu-item.router-link-active {
    color: #7e57c2;
    font-weight: bold;
}

.logout-btn {
  border: none;
  background: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
  color: #e53e3e;
}

.logout-btn:hover {
  background: rgba(229, 62, 62, 0.1);
}
</style>