<!-- src/components/Navbar.vue -->
<template>
    <nav class="navbar">
        <div class="navbar-container">
            <router-link to="/" class="navbar-logo">
                <span>OaxacaGlow</span>
            </router-link>

            <ul class="navbar-menu">
                <li><router-link to="/">Inicio</router-link></li>
                <li><router-link to="/servicios">Servicios</router-link></li>
                
                <!-- Solo para usuarios NO autenticados -->
                <li v-if="!authStore.isAuthenticated">
                    <router-link to="/login">Iniciar Sesión</router-link>
                </li>
                <li v-if="!authStore.isAuthenticated">
                    <router-link to="/registro">Registrarse</router-link>
                </li>

                <!-- Solo para usuarios autenticados -->
                <li v-if="authStore.isAuthenticated && authStore.isProveedor">
                    <router-link to="/dashboard">Dashboard</router-link>
                </li>
                <li v-if="authStore.isAuthenticated && authStore.isCliente">
                    <router-link to="/cliente/mis-citas">Mis Citas</router-link>
                </li>
                <li v-if="authStore.isAuthenticated">
                    <span class="user-name">{{ authStore.userName }}</span>
                </li>
                <li v-if="authStore.isAuthenticated">
                    <button @click="handleLogout" class="btn-logout">
                        Cerrar Sesión
                    </button>
                </li>
            </ul>
        </div>
    </nav>
</template>

<script>
import { useAuthStore } from '../store';
import { useRouter } from 'vue-router';

export default {
    name: 'Navbar',
    setup() {
        const authStore = useAuthStore();
        const router = useRouter();

        const handleLogout = () => {
            console.log('👋 Usuario cerrando sesión...');
            authStore.logout();
            router.push('/');
        };

        return {
            authStore,
            handleLogout
        };
    }
}
</script>

<style scoped>
.navbar {
    background: linear-gradient(135deg, #791236, #a31d4a);
    padding: 1rem 2rem;
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.navbar-container {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.navbar-logo {
    color: white;
    font-size: 1.5rem;
    font-weight: bold;
    text-decoration: none;
}

.navbar-menu {
    display: flex;
    list-style: none;
    gap: 2rem;
    align-items: center;
}

.navbar-menu a {
    color: white;
    text-decoration: none;
    font-weight: 500;
    transition: color 0.3s;
}

.navbar-menu a:hover {
    color: #f3d6e0;
}

.user-name {
    color: white;
    font-weight: 600;
}

.btn-logout {
    padding: 8px 20px;
    background: rgba(255, 255, 255, 0.2);
    border: 2px solid white;
    color: white;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s;
}

.btn-logout:hover {
    background: white;
    color: #791236;
}
</style>
