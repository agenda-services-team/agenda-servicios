<!-- src/views/Servicios.vue - CON HEADER INTEGRADO -->
<template>
    <div class="services-page">
        <!-- Header integrado con buscador y menú usuario -->
        <header class="services-header">
            <div class="header-content">
                <!-- Logo y título -->
                <div class="header-left">
                    <router-link to="/servicios" class="logo-link">
                        <img src="/src/assets/logo.png" alt="OaxacaGlow" class="logo-img" />
                        <span class="logo-text">OaxacaGlow</span>
                    </router-link>
                </div>

                <!-- Buscador centrado -->
                <div class="header-center">
                    <div class="search-container">
                        <svg class="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="11" cy="11" r="8"></circle>
                            <path d="m21 21-4.3-4.3"></path>
                        </svg>
                        <input 
                            v-model="filtroBusqueda" 
                            type="text" 
                            placeholder="Buscar servicios..." 
                            class="search-input"
                        >
                    </div>
                </div>

                <!-- Menú de usuario -->
                <div class="header-right">
                    <div class="user-menu">
                        <!-- Avatar y nombre -->
                        <div class="user-info" @click="toggleUserMenu">
                            <div class="user-avatar">
                                {{ userInitials }}
                            </div>
                            <span class="user-name">{{ userName }}</span>
                            <svg class="chevron-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <polyline points="6 9 12 15 18 9"></polyline>
                            </svg>
                        </div>

                        <!-- Menú desplegable -->
                        <div class="user-dropdown" :class="{ 'dropdown-open': userMenuOpen }">
                            <router-link to="/mis-citas" class="dropdown-item" @click="closeUserMenu">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                    <line x1="16" y1="2" x2="16" y2="6"></line>
                                    <line x1="8" y1="2" x2="8" y2="6"></line>
                                    <line x1="3" y1="10" x2="21" y2="10"></line>
                                </svg>
                                Mis Citas
                            </router-link>
                            
                            <router-link to="/perfil" class="dropdown-item" @click="closeUserMenu">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                                    <circle cx="12" cy="7" r="4"></circle>
                                </svg>
                                Mi Perfil
                            </router-link>
                            
                            <div class="dropdown-divider"></div>
                            
                            <button @click="handleLogout" class="dropdown-item logout-item">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                                    <polyline points="16,17 21,12 16,7"></polyline>
                                    <line x1="21" y1="12" x2="9" y2="12"></line>
                                </svg>
                                Cerrar Sesión
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>

        <!-- Contenido principal (sin cambios) -->
        <div class="services-content">
            <!-- Título y contador -->
            <div class="page-title-section">
                <h1 class="page-title">Servicios Disponibles</h1>
                <p class="page-subtitle">Descubre los mejores servicios en OaxacaGlow</p>
                <div class="services-count">
                    <span class="count-badge">{{ servicios.length }} servicios encontrados</span>
                </div>
            </div>

            <!-- Estado de carga -->
            <div v-if="loading" class="loading-container">
                <div class="loading-spinner"></div>
                <p class="loading-text">Cargando servicios...</p>
            </div>

            <!-- Contenido principal -->
            <div v-else class="services-main">
                <!-- Mensaje cuando no hay servicios -->
                <div v-if="serviciosFiltrados.length === 0" class="empty-state">
                    <div class="empty-icon">🔍</div>
                    <h3>No se encontraron servicios</h3>
                    <p v-if="filtroBusqueda">Intenta con otros términos de búsqueda</p>
                    <p v-else>Pronto tendremos nuevos servicios disponibles</p>
                    <button @click="cargarServicios" class="retry-btn">Reintentar</button>
                </div>

                <!-- Grid de servicios -->
                <div v-else class="services-grid">
                    <div 
                        v-for="servicio in serviciosFiltrados" 
                        :key="servicio.id_servicio" 
                        class="service-card"
                        @click="verDetalleServicio(servicio)"
                    >
                        <!-- Contenido de la tarjeta (sin cambios) -->
                        <div class="card-image-container">
                            <img 
                                :src="servicio.imagen_referencia || '/src/images/default-service.jpg'" 
                                :alt="servicio.nombre"
                                class="service-image"
                                @error="handleImageError"
                            />
                            <div class="image-overlay">
                                <span class="view-details">Ver detalles</span>
                            </div>
                            <div class="price-tag">
                                ${{ servicio.precio }}
                            </div>
                        </div>
                        
                        <div class="card-content">
                            <div class="service-header">
                                <h3 class="service-name">{{ servicio.nombre }}</h3>
                                <div class="duration-badge">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    {{ servicio.duracion }}min
                                </div>
                            </div>
                            
                            <p class="service-description">{{ servicio.descripcion }}</p>
                            
                            <div class="service-footer">
                                <div class="provider-info">
                                    <div class="provider-avatar">
                                        {{ getInitials(servicio.nombre_proveedor) }}
                                    </div>
                                    <div class="provider-details">
                                        <span class="provider-name">{{ servicio.nombre_proveedor }}</span>
                                        <span class="provider-business">{{ servicio.nombre_emprendimiento }}</span>
                                    </div>
                                </div>
                                <button class="reserve-btn" @click.stop="reservarServicio(servicio)">
                                    Reservar
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '../store';
import { mapState, mapActions } from 'pinia';

export default {
    data() {
        return {
            servicios: [],
            loading: true,
            filtroBusqueda: '',
            userMenuOpen: false
        }
    },
    computed: {
        ...mapState(useAuthStore, ['userName']),
        serviciosFiltrados() {
            if (!this.filtroBusqueda) return this.servicios;
            
            const searchTerm = this.filtroBusqueda.toLowerCase();
            return this.servicios.filter(servicio => 
                servicio.nombre.toLowerCase().includes(searchTerm) ||
                servicio.descripcion.toLowerCase().includes(searchTerm) ||
                servicio.nombre_proveedor.toLowerCase().includes(searchTerm) ||
                servicio.nombre_emprendimiento.toLowerCase().includes(searchTerm)
            );
        },
        userInitials() {
            return this.userName
                ?.split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .substring(0, 2) || 'US';
        }
    },
    async mounted() {
        await this.cargarServicios();
        // Cerrar menú al hacer clic fuera
        document.addEventListener('click', this.handleClickOutside);
    },
    beforeUnmount() {
        document.removeEventListener('click', this.handleClickOutside);
    },
    methods: {
        ...mapActions(useAuthStore, ['logout']),
        async cargarServicios() {
            this.loading = true;
            try {
                const endpoint = "http://localhost:4000/api/servicios/public/todos";
                const respuesta = await fetch(endpoint, {
                    headers: {
                        "Content-Type": "application/json"
                    },
                    method: 'GET'
                });

                if (!respuesta.ok) {
                    throw new Error(`Error ${respuesta.status}`);
                }

                const data = await respuesta.json();
                this.servicios = data;
            } catch (error) {
                console.error('Error al cargar servicios:', error);
            } finally {
                this.loading = false;
            }
        },

        getInitials(nombre) {
            return nombre
                ?.split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .substring(0, 2) || 'PR';
        },

        handleImageError(event) {
            event.target.src = '/src/images/default-service.jpg';
        },

        verDetalleServicio(servicio) {
            if (servicio && servicio.id_servicio) {
                this.$router.push({ name: 'servicio-detalle', params: { id: servicio.id_servicio } });
            } else {
                console.log('Ver detalle (sin id):', servicio);
            }
        },

        reservarServicio(servicio) {
            console.log('Reservar servicio:', servicio);
        },

        toggleUserMenu() {
            this.userMenuOpen = !this.userMenuOpen;
        },

        closeUserMenu() {
            this.userMenuOpen = false;
        },

        handleClickOutside(event) {
            if (!event.target.closest('.user-menu')) {
                this.userMenuOpen = false;
            }
        },

        handleLogout() {
            this.logout();
            this.$router.push('/');
        }
    }
}
</script>

<style scoped>
/* ========== HEADER INTEGRADO ========== */
.services-header {
    background: white;
    box-shadow: 0 2px 20px rgba(0,0,0,0.08);
    position: sticky;
    top: 0;
    z-index: 1000;
    padding: 1rem 0;
}

.header-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    gap: 2rem;
}

/* Logo */
.header-left {
    flex-shrink: 0;
}

.logo-link {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: #791236;
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

/* Buscador */
.header-center {
    flex: 1;
    max-width: 500px;
}

.search-container {
    position: relative;
    width: 100%;
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
}

/* Menú de usuario */
.header-right {
    flex-shrink: 0;
}

.user-menu {
    position: relative;
}

.user-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.5rem 1rem;
    border-radius: 25px;
    background: #f8fafc;
    cursor: pointer;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

.user-info:hover {
    background: white;
    border-color: #e8ecef;
    box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

.user-avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #791236, #553a6a);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 0.9rem;
    flex-shrink: 0;
}

.user-name {
    font-weight: 600;
    color: #333;
    font-size: 0.9rem;
}

.chevron-icon {
    color: #666;
    transition: transform 0.3s ease;
}

.user-dropdown {
    position: absolute;
    top: 100%;
    right: 0;
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.15);
    padding: 0.75rem;
    min-width: 200px;
    display: none;
    border: 1px solid #f0f0f0;
    margin-top: 0.5rem;
}

.user-dropdown.dropdown-open {
    display: block;
    animation: slideDown 0.3s ease;
}

.dropdown-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem 1rem;
    text-decoration: none;
    color: #444;
    font-weight: 500;
    border-radius: 8px;
    transition: all 0.3s ease;
    border: none;
    background: none;
    cursor: pointer;
    width: 100%;
    text-align: left;
    font-size: 0.9rem;
}

.dropdown-item:hover {
    background: linear-gradient(135deg, #fce9ee, #f8f0f3);
    color: #791236;
}

.logout-item:hover {
    background: linear-gradient(135deg, #fee, #fff5f5);
    color: #dc3545;
}

.dropdown-divider {
    height: 1px;
    background: #f0f0f0;
    margin: 0.5rem 0;
}

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

/* ========== CONTENIDO PRINCIPAL ========== */
.services-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f6fbfb 0%, #f0f7ff 100%);
}

.services-content {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.page-title-section {
    text-align: center;
    margin-bottom: 3rem;
}

.page-title {
    font-size: clamp(1.8rem, 5vw, 2.5rem);
    font-weight: 800;
    background: linear-gradient(135deg, #791236 0%, #553a6a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 0.5rem;
    line-height: 1.2;
}

.page-subtitle {
    font-size: clamp(0.9rem, 2.5vw, 1.1rem);
    color: #666;
    margin-bottom: 1.5rem;
    line-height: 1.4;
}

.services-count {
    display: inline-flex;
}

.count-badge {
    background: #791236;
    color: white;
    padding: 0.5rem 1.5rem;
    border-radius: 20px;
    font-size: clamp(0.8rem, 2vw, 0.9rem);
    font-weight: 600;
}

/* ========== RESPONSIVE HEADER ========== */
@media (max-width: 768px) {
    .header-content {
        padding: 0 1rem;
        gap: 1rem;
    }
    
    .logo-text {
        display: none;
    }
    
    .user-name {
        display: none;
    }
    
    .user-info {
        padding: 0.5rem;
    }
    
    .services-content {
        padding: 1rem;
    }
}

@media (max-width: 480px) {
    .header-center {
        display: none;
    }
    
    .services-content {
        padding: 0.5rem;
    }
}


/* ========== MEDIA QUERIES ========== */



/* Desktop (≥1024px) */
@media (min-width: 1024px) {
    .services-page {
        padding: 2rem;
    }
    
    .services-grid {
        grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
        gap: 2rem;
    }
    
    .page-header {
        margin-bottom: 3rem;
    }
}

/* Pantallas grandes (≥1280px) */
@media (min-width: 1280px) {
    .services-grid {
        grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    }
}

/* Móviles pequeños (≤480px) */
@media (max-width: 480px) {
    .services-page {
        padding: 0.75rem;
    }
    
    .services-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .service-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 0.5rem;
    }
    
    .duration-badge {
        align-self: flex-start;
    }
    
    .provider-business {
        display: none;
    }
    
    .card-content {
        padding: 1rem;
    }
}

/* Orientación landscape en móviles */
@media (max-height: 600px) and (orientation: landscape) {
    .services-page {
        padding: 1rem 0.75rem;
    }
    
    .card-image-container {
        aspect-ratio: 16/8;
    }
}

/* Alto contraste y accesibilidad */
@media (prefers-contrast: high) {
    .service-card {
        border: 2px solid #333;
    }
    
    .price-tag {
        background: white;
        border: 1px solid #333;
    }
}

/* Modo oscuro (opcional) */
@media (prefers-color-scheme: dark) {
    .services-page {
        background: linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%);
    }
    
    .service-card {
        background: #2d2d2d;
        border-color: #404040;
    }
    
    .service-name {
        color: #fff;
    }
    
    .service-description {
        color: #ccc;
    }
    
    .search-input {
        background: #2d2d2d;
        border-color: #404040;
        color: #fff;
    }
}
</style>