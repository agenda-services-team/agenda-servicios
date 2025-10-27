<!-- src/components/ClientNavbar.vue - NUEVO COMPONENTE -->
<template>
    <nav class="client-navbar">
        <!-- Logo -->
        <div class="nav-brand">
            <router-link to="/servicios" class="logo-link">
                <img src="/src/assets/logo.png" alt="OaxacaGlow" class="logo-img" />
                <span class="logo-text">OaxacaGlow</span>
            </router-link>
        </div>
        
        <!-- Buscador centrado -->
        <div class="nav-center">
            <div class="search-container">
                <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                </svg>
                <input 
                    type="text" 
                    placeholder="Buscar servicios..." 
                    class="search-input"
                    v-model="searchQuery"
                    @input="handleSearch"
                />
            </div>
        </div>
        
        <!-- Menú de usuario -->
        <div class="nav-user">
            <div class="user-menu">
                <!-- Menú hamburguesa móvil -->
                <button class="menu-toggle" @click="toggleMenu" v-if="isMobile">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <line x1="3" y1="6" x2="21" y2="6"></line>
                        <line x1="3" y1="12" x2="21" y2="12"></line>
                        <line x1="3" y1="18" x2="21" y2="18"></line>
                    </svg>
                </button>
                
                <!-- Opciones de usuario -->
                <div class="user-options" :class="{ 'mobile-open': menuOpen }">
                    <router-link to="/mis-citas" class="user-option" @click="closeMenu">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                            <line x1="16" y1="2" x2="16" y2="6"></line>
                            <line x1="8" y1="2" x2="8" y2="6"></line>
                            <line x1="3" y1="10" x2="21" y2="10"></line>
                        </svg>
                        Mis Citas
                    </router-link>
                    
                    <router-link to="/perfil" class="user-option" @click="closeMenu">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                            <circle cx="12" cy="7" r="4"></circle>
                        </svg>
                        Mi Perfil
                    </router-link>
                    
                    <button @click="handleLogout" class="user-option logout-btn">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16,17 21,12 16,7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Cerrar Sesión
                    </button>
                </div>
                
                <!-- Avatar -->
                <div class="user-avatar" @click="toggleMenu">
                    {{ userInitials }}
                    <span class="user-name-mobile">{{ userName }}</span>
                </div>
            </div>
        </div>
    </nav>
</template>

<script>
import { useAuthStore } from '../store';
import { mapState, mapActions } from 'pinia';

export default {
    name: 'ClientNavbar',
    data() {
        return {
            searchQuery: '',
            menuOpen: false,
            isMobile: false
        }
    },
    computed: {
        ...mapState(useAuthStore, ['isAuthenticated', 'userName']),
        userInitials() {
            return this.userName
                ?.split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .substring(0, 2) || 'US';
        }
    },
    methods: {
        ...mapActions(useAuthStore, ['logout']),
        toggleMenu() {
            this.menuOpen = !this.menuOpen;
        },
        closeMenu() {
            this.menuOpen = false;
        },
        checkMobile() {
            this.isMobile = window.innerWidth < 768;
        },
        handleSearch() {
            // Emitir evento de búsqueda al componente padre
            this.$emit('search', this.searchQuery);
        },
        handleLogout() {
            this.logout();
            this.closeMenu();
            this.$router.push('/');
        }
    },
    mounted() {
        this.checkMobile();
        window.addEventListener('resize', this.checkMobile);
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeUnmount() {
        window.removeEventListener('resize', this.checkMobile);
        document.removeEventListener('click', this.handleClickOutside);
    }
}
</script>

<style scoped>
.client-navbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: white;
    box-shadow: 0 2px 20px rgba(0,0,0,0.1);
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 1000;
    height: 70px;
    backdrop-filter: blur(10px);
}

/* Logo */
.nav-brand {
    flex-shrink: 0;
}

.logo-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: #791236;
    transition: transform 0.3s ease;
}

.logo-link:hover {
    transform: scale(1.02);
}

.logo-img {
    height: 35px;
    width: auto;
}

.logo-text {
    font-size: 1.5rem;
    font-weight: 800;
    letter-spacing: -0.5px;
}

/* Buscador centrado */
.nav-center {
    flex: 1;
    display: flex;
    justify-content: center;
    max-width: 500px;
    margin: 0 2rem;
}

.search-container {
    position: relative;
    width: 100%;
    max-width: 450px;
}

.search-icon {
    position: absolute;
    left: 16px;
    top: 50%;
    transform: translateY(-50%);
    color: #666;
    z-index: 2;
}

.search-input {
    width: 100%;
    padding: 0.85rem 1rem 0.85rem 3rem;
    border: 2px solid #e8ecef;
    border-radius: 30px;
    font-size: 1rem;
    background: #f8fafc;
    transition: all 0.3s ease;
    color: #333;
    font-weight: 500;
}

.search-input:focus {
    outline: none;
    border-color: #791236;
    background: white;
    box-shadow: 0 0 0 4px rgba(121, 18, 54, 0.1);
    transform: scale(1.02);
}

.search-input::placeholder {
    color: #888;
    font-weight: 400;
}

/* Menú de usuario */
.nav-user {
    flex-shrink: 0;
}

.user-menu {
    display: flex;
    align-items: center;
    gap: 1rem;
    position: relative;
}

.menu-toggle {
    display: none;
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    color: #666;
    border-radius: 8px;
    transition: background 0.3s ease;
}

.menu-toggle:hover {
    background: #f5f5f5;
}

.user-options {
    display: flex;
    align-items: center;
    gap: 0.75rem;
}

.user-option {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    padding: 0.6rem 1.2rem;
    border-radius: 10px;
    text-decoration: none;
    color: #444;
    font-size: 0.9rem;
    font-weight: 600;
    transition: all 0.3s ease;
    border: none;
    background: none;
    cursor: pointer;
    white-space: nowrap;
}

.user-option:hover {
    background: linear-gradient(135deg, #fce9ee, #f8f0f3);
    color: #791236;
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(121, 18, 54, 0.1);
}

.logout-btn:hover {
    background: linear-gradient(135deg, #fee, #fff5f5);
    color: #dc3545;
}

.user-avatar {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.5rem 1rem;
    background: linear-gradient(135deg, #791236, #553a6a);
    color: white;
    border-radius: 25px;
    font-weight: 700;
    font-size: 0.9rem;
    cursor: pointer;
    transition: all 0.3s ease;
    min-width: 50px;
    justify-content: center;
}

.user-avatar:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 15px rgba(121, 18, 54, 0.3);
}

.user-name-mobile {
    display: none;
    font-size: 0.8rem;
}

/* ========== RESPONSIVE ========== */
@media (max-width: 768px) {
    .client-navbar {
        padding: 0.75rem 1rem;
    }
    
    .nav-center {
        margin: 0 1rem;
        display: none; /* Ocultar buscador en móvil por ahora */
    }
    
    .menu-toggle {
        display: block;
    }
    
    .user-options {
        position: absolute;
        top: 100%;
        right: 0;
        background: white;
        border-radius: 16px;
        box-shadow: 0 10px 40px rgba(0,0,0,0.15);
        flex-direction: column;
        padding: 1rem;
        min-width: 220px;
        display: none;
        border: 1px solid #f0f0f0;
    }
    
    .user-options.mobile-open {
        display: flex;
    }
    
    .user-option {
        width: 100%;
        justify-content: flex-start;
        padding: 0.75rem 1rem;
    }
    
    .logo-text {
        display: none;
    }
    
    .user-name-mobile {
        display: inline;
    }
    
    .user-avatar {
        padding: 0.4rem 0.8rem;
    }
}

@media (max-width: 480px) {
    .client-navbar {
        padding: 0.5rem;
    }
    
    .nav-center {
        display: none;
    }
    
    .user-avatar {
        min-width: 45px;
        font-size: 0.8rem;
    }
}

/* Animaciones */
@keyframes slideDown {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.user-options.mobile-open {
    animation: slideDown 0.3s ease;
}
</style>