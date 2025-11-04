<!-- src/components/Navbar.vue -->
<template>
    <nav class="navbar" role="navigation" aria-label="Navegación principal">
        <div class="navbar-container">
            <!-- Logo -->
            <router-link to="/" class="navbar-logo" aria-label="Ir al inicio">
                <span class="logo-text">OaxacaGlow</span>
                <span class="logo-subtitle" v-if="!isMobile">Beauty & Wellness</span>
            </router-link>

            <!-- Menú para móvil -->
            <button 
                class="navbar-toggle"
                @click="toggleMobileMenu"
                :aria-expanded="isMobileMenuOpen.toString()"
                aria-label="Alternar menú de navegación"
                aria-controls="navbar-menu"
            >
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
            </button>

            <!-- Menú de navegación -->
            <ul 
                id="navbar-menu"
                class="navbar-menu"
                :class="{ 'navbar-menu--open': isMobileMenuOpen }"
            >
                <!-- Enlaces públicos -->
                <li class="navbar-item">
                    <router-link 
                        to="/" 
                        class="navbar-link"
                        @click="closeMobileMenu"
                        exact-active-class="navbar-link--active"
                    >
                        Inicio
                    </router-link>
                </li>
                <li class="navbar-item">
                    <router-link 
                        to="/servicios" 
                        class="navbar-link"
                        @click="closeMobileMenu"
                        active-class="navbar-link--active"
                    >
                        Servicios
                    </router-link>
                </li>

                <!-- Enlaces para usuarios NO autenticados -->
                <template v-if="!authStore.isAuthenticated">
                    <li class="navbar-item">
                        <router-link 
                            to="/login" 
                            class="navbar-link"
                            @click="closeMobileMenu"
                            active-class="navbar-link--active"
                        >
                            Iniciar Sesión
                        </router-link>
                    </li>
                    <li class="navbar-item">
                        <router-link 
                            to="/registro" 
                            class="navbar-link navbar-link--highlight"
                            @click="closeMobileMenu"
                            active-class="navbar-link--active"
                        >
                            Registrarse
                        </router-link>
                    </li>
                </template>

                <!-- Enlaces para usuarios autenticados -->
                <template v-else>
                    <!-- Proveedor -->
                    <li v-if="authStore.isProveedor" class="navbar-item">
                        <router-link 
                            to="/dashboard" 
                            class="navbar-link navbar-link--dashboard"
                            @click="closeMobileMenu"
                            active-class="navbar-link--active"
                        >
                            <span class="link-icon">📊</span>
                            Dashboard
                        </router-link>
                    </li>

                    <!-- Cliente -->
                    <li v-if="authStore.isCliente" class="navbar-item">
                        <router-link 
                            to="/cliente/mis-citas" 
                            class="navbar-link"
                            @click="closeMobileMenu"
                            active-class="navbar-link--active"
                        >
                            <span class="link-icon">📅</span>
                            Mis Citas
                        </router-link>
                    </li>

                    <!-- Menú de usuario -->
                    <li class="navbar-item navbar-user">
                        <div class="user-info">
                            <span class="user-avatar">👤</span>
                            <span class="user-name">{{ authStore.userName }}</span>
                        </div>
                    </li>

                    <li class="navbar-item">
                        <button 
                            @click="handleLogout" 
                            class="btn-logout"
                            aria-label="Cerrar sesión"
                        >
                            <span class="logout-icon">🚪</span>
                            Salir
                        </button>
                    </li>
                </template>
            </ul>

            <!-- Overlay para móvil -->
            <div 
                v-if="isMobileMenuOpen" 
                class="navbar-overlay"
                @click="closeMobileMenu"
            ></div>
        </div>
    </nav>
</template>

<script setup>
import { useAuthStore } from '../store';
import { useRouter } from 'vue-router';
import { ref, onMounted, onUnmounted } from 'vue';

const authStore = useAuthStore();
const router = useRouter();

// Estado del menú móvil
const isMobileMenuOpen = ref(false);
const isMobile = ref(false);

// Detectar tamaño de pantalla
const checkScreenSize = () => {
    isMobile.value = window.innerWidth < 768;
};

// Toggle menú móvil
const toggleMobileMenu = () => {
    isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

// Cerrar menú móvil
const closeMobileMenu = () => {
    isMobileMenuOpen.value = false;
};

// Manejar logout
const handleLogout = async () => {
    console.log('👋 Usuario cerrando sesión...');
    
    // Cerrar menú móvil si está abierto
    closeMobileMenu();
    
    // Pequeño delay para mejor UX
    setTimeout(() => {
        authStore.logout();
        router.push('/');
    }, 300);
};

// Event listeners para responsive
onMounted(() => {
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => {
    window.removeEventListener('resize', checkScreenSize);
});
</script>

<style scoped>
.navbar {
    background: linear-gradient(135deg, #791236 0%, #a31d4a 100%);
    padding: 1rem 2rem;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
    position: sticky;
    top: 0;
    z-index: 1000;
    backdrop-filter: blur(10px);
}

.navbar-container {
    max-width: 1400px;
    margin: 0 auto;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
}

/* Logo */
.navbar-logo {
    color: white;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

.logo-text {
    font-size: 1.5rem;
    font-weight: bold;
    line-height: 1;
}

.logo-subtitle {
    font-size: 0.7rem;
    opacity: 0.8;
    font-weight: normal;
    margin-top: 2px;
}

/* Menú principal */
.navbar-menu {
    display: flex;
    list-style: none;
    gap: 1.5rem;
    align-items: center;
    margin: 0;
    padding: 0;
}

.navbar-item {
    position: relative;
}

.navbar-link {
    color: white;
    text-decoration: none;
    font-weight: 500;
    padding: 0.5rem 1rem;
    border-radius: 25px;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.navbar-link:hover {
    background: rgba(255, 255, 255, 0.15);
    transform: translateY(-1px);
}

.navbar-link--active {
    background: rgba(255, 255, 255, 0.2);
    font-weight: 600;
}

.navbar-link--highlight {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
}

.navbar-link--highlight:hover {
    background: rgba(255, 255, 255, 0.3);
}

.navbar-link--dashboard {
    background: rgba(255, 255, 255, 0.1);
    border: 1px dashed rgba(255, 255, 255, 0.4);
}

/* Información de usuario */
.navbar-user {
    margin-left: 1rem;
    padding-left: 1rem;
    border-left: 1px solid rgba(255, 255, 255, 0.3);
}

.user-info {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: white;
}

.user-avatar {
    font-size: 1.2rem;
}

.user-name {
    font-weight: 600;
    max-width: 120px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

/* Botón de logout */
.btn-logout {
    padding: 0.5rem 1.2rem;
    background: rgba(255, 255, 255, 0.15);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
    border-radius: 25px;
    cursor: pointer;
    font-weight: 500;
    transition: all 0.3s ease;
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.btn-logout:hover {
    background: rgba(255, 255, 255, 0.25);
    transform: translateY(-1px);
}

/* Botón hamburguesa para móvil */
.navbar-toggle {
    display: none;
    flex-direction: column;
    background: none;
    border: none;
    cursor: pointer;
    padding: 0.5rem;
    gap: 4px;
}

.hamburger-line {
    width: 25px;
    height: 3px;
    background: white;
    border-radius: 2px;
    transition: all 0.3s ease;
}

/* Responsive */
@media (max-width: 768px) {
    .navbar {
        padding: 1rem;
    }

    .navbar-toggle {
        display: flex;
    }

    .navbar-menu {
        position: fixed;
        top: 0;
        right: -100%;
        height: 100vh;
        width: 280px;
        background: linear-gradient(135deg, #791236 0%, #a31d4a 100%);
        flex-direction: column;
        justify-content: flex-start;
        align-items: stretch;
        padding: 5rem 2rem 2rem;
        gap: 0;
        transition: right 0.3s ease;
        box-shadow: -5px 0 25px rgba(0, 0, 0, 0.2);
    }

    .navbar-menu--open {
        right: 0;
    }

    .navbar-item {
        width: 100%;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }

    .navbar-link {
        padding: 1rem 0;
        border-radius: 0;
        justify-content: flex-start;
    }

    .navbar-user {
        border-left: none;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        margin: 1rem 0 0 0;
        padding: 1rem 0;
    }

    .btn-logout {
        justify-content: center;
        margin-top: 1rem;
    }

    .logo-subtitle {
        display: none;
    }
}

/* Overlay para móvil */
.navbar-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.5);
    z-index: -1;
}

/* Iconos */
.link-icon, .logout-icon {
    font-size: 1rem;
}

/* Mejoras de accesibilidad */
@media (prefers-reduced-motion: reduce) {
    .navbar-link,
    .btn-logout {
        transition: none;
    }
}

/* Focus styles para accesibilidad */
.navbar-link:focus,
.btn-logout:focus,
.navbar-toggle:focus {
    outline: 2px solid white;
    outline-offset: 2px;
}
</style>