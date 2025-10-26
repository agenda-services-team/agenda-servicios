<!-- src/components/Navbar.vue -->
<template>
    <nav class="navbar" v-if="showNavbar">
        <div class="nav-brand">
            <router-link to="/">OaxacaGlow</router-link>
        </div>
        
        <div class="nav-links">
            <!-- Mostrar estos links si el usuario NO está autenticado -->
            <div v-if="!isAuthenticated" class="auth-links">
                <router-link to="/login" class="nav-link">Iniciar Sesión</router-link>
                <router-link to="/registro" class="nav-link btn-primary">Unirme</router-link>
            </div>
            
            <!-- Mostrar estos links si el usuario SÍ está autenticado -->
            <div v-else class="user-links">
                <span class="user-welcome">Hola, {{ userName }}</span>
                <router-link v-if="isProveedor" to="/dashboard" class="nav-link">Dashboard</router-link>
                <router-link v-else to="/servicios" class="nav-link">Servicios</router-link>
                <button @click="logout" class="nav-link btn-logout">Cerrar Sesión</button>
            </div>
        </div>
    </nav>
</template>

<script>
export default {
    name: 'Navbar',
    data() {
        return {
            isAuthenticated: false,
            userName: '',
            userType: ''
        }
    },
    computed: {
        showNavbar() {
            // Opcional: Ocultar navbar en ciertas rutas
            const hiddenRoutes = ['/login', '/registro'];
            return !hiddenRoutes.includes(this.$route.path);
        },
        isProveedor() {
            return this.userType === 'proveedor' || this.userType === 'prestador';
        }
    },
    mounted() {
        this.checkAuth();
        // Escuchar cambios en localStorage
        window.addEventListener('storage', this.checkAuth);
    },
    beforeUnmount() {
        window.removeEventListener('storage', this.checkAuth);
    },
    methods: {
        checkAuth() {
            const token = localStorage.getItem('token');
            this.isAuthenticated = !!token;
            this.userName = localStorage.getItem('nombre') || 'Usuario';
            this.userType = localStorage.getItem('tipo_usuario') || '';
        },
        logout() {
            localStorage.removeItem('token');
            localStorage.removeItem('nombre');
            localStorage.removeItem('tipo_usuario');
            localStorage.removeItem('id_usuario');
            this.isAuthenticated = false;
            this.$router.push('/');
        }
    },
    watch: {
        '$route'() {
            this.checkAuth();
        }
    }
}
</script>

<style scoped>
.navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: white;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
    position: sticky;
    top: 0;
    z-index: 1000;
}

.nav-brand {
    font-size: 1.5rem;
    font-weight: bold;
}

.nav-brand a {
    color: #791236;
    text-decoration: none;
}

.nav-links {
    display: flex;
    align-items: center;
    gap: 1.5rem;
}

.auth-links, .user-links {
    display: flex;
    align-items: center;
    gap: 1rem;
}

.nav-link {
    color: #333;
    text-decoration: none;
    padding: 0.5rem 1rem;
    border-radius: 6px;
    transition: all 0.3s ease;
}

.nav-link:hover {
    background: #f5f5f5;
}

.btn-primary {
    background: #791236;
    color: white !important;
}

.btn-primary:hover {
    background: #a31d4a;
}

.btn-logout {
    background: #dc3545;
    color: white !important;
    border: none;
    cursor: pointer;
}

.btn-logout:hover {
    background: #c82333;
}

.user-welcome {
    color: #666;
    font-weight: 500;
}

@media (max-width: 768px) {
    .navbar {
        padding: 1rem;
    }
    
    .nav-links {
        gap: 0.5rem;
    }
    
    .user-welcome {
        display: none;
    }
}
</style>