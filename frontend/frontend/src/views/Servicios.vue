<template>
    <div class="services-page">
        <!-- Header principal -->
        <div class="page-header">
            <h1 class="page-title">Servicios Disponibles</h1>
            <p class="page-subtitle">Descubre los mejores servicios en OaxacaGlow</p>
            
            <!-- Contador y filtros -->
            <div class="header-actions">
                <div class="services-count">
                    <span class="count-badge">{{ servicios.length }} servicios</span>
                </div>
                <div class="search-section">
                    <div class="search-box">
                        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
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
            </div>
        </div>

        <!-- Estado de carga -->
        <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p class="loading-text">Cargando servicios...</p>
        </div>

        <!-- Grid de servicios -->
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

        <!-- Botón de debug (oculto por defecto) -->
        <div class="debug-floating">
            <button @click="toggleDebug" class="debug-toggle">
                🐛
            </button>
            <div v-if="showDebug" class="debug-panel">
                <h4>Información de Debug</h4>
                <pre>{{ debugData }}</pre>
                <button @click="cargarServicios" class="debug-btn">Recargar</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            servicios: [],
            loading: true,
            showDebug: false,
            filtroBusqueda: '',
            debugData: {}
        }
    },
    computed: {
        serviciosFiltrados() {
            if (!this.filtroBusqueda) return this.servicios;
            
            const searchTerm = this.filtroBusqueda.toLowerCase();
            return this.servicios.filter(servicio => 
                servicio.nombre.toLowerCase().includes(searchTerm) ||
                servicio.descripcion.toLowerCase().includes(searchTerm) ||
                servicio.nombre_proveedor.toLowerCase().includes(searchTerm) ||
                servicio.nombre_emprendimiento.toLowerCase().includes(searchTerm)
            );
        }
    },
    async mounted() {
        await this.cargarServicios();
    },
    methods: {
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
                // Podrías agregar una notificación más elegante aquí
            } finally {
                this.loading = false;
            }
        },

        getInitials(nombre) {
            return nombre
                .split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .substring(0, 2);
        },

        handleImageError(event) {
            event.target.src = '/src/images/default-service.jpg';
        },

        verDetalleServicio(servicio) {
            // Aquí puedes implementar la navegación al detalle del servicio
            console.log('Ver detalle:', servicio);
            // this.$router.push(`/servicio/${servicio.id_servicio}`);
        },

        reservarServicio(servicio) {
            // Aquí puedes implementar la lógica de reserva
            console.log('Reservar servicio:', servicio);
            // this.$router.push(`/reservar/${servicio.id_servicio}`);
        },

        toggleDebug() {
            this.showDebug = !this.showDebug;
            if (this.showDebug) {
                this.debugData = {
                    totalServicios: this.servicios.length,
                    serviciosFiltrados: this.serviciosFiltrados.length,
                    filtroActivo: this.filtroBusqueda,
                    primerServicio: this.servicios.length > 0 ? this.servicios[0] : 'No hay servicios'
                };
            }
        }
    }
}
</script>

<style scoped>
.services-page {
    min-height: 100vh;
    background: linear-gradient(135deg, #f6fbfb 0%, #f0f7ff 100%);
    padding: 20px;
}

.page-header {
    text-align: center;
    margin-bottom: 40px;
}

.page-title {
    font-size: 2.5rem;
    font-weight: 800;
    background: linear-gradient(135deg, #791236 0%, #553a6a 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    margin-bottom: 8px;
}

.page-subtitle {
    font-size: 1.1rem;
    color: #666;
    margin-bottom: 30px;
}

.header-actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    max-width: 800px;
    margin: 0 auto;
    gap: 20px;
}

.services-count {
    display: flex;
    align-items: center;
}

.count-badge {
    background: #791236;
    color: white;
    padding: 8px 16px;
    border-radius: 20px;
    font-size: 0.9rem;
    font-weight: 600;
}

.search-section {
    flex: 1;
    max-width: 400px;
}

.search-box {
    position: relative;
    display: flex;
    align-items: center;
}

.search-icon {
    position: absolute;
    left: 12px;
    color: #999;
}

.search-input {
    width: 100%;
    padding: 12px 12px 12px 40px;
    border: 2px solid #e1e5e9;
    border-radius: 25px;
    font-size: 1rem;
    transition: all 0.3s ease;
    background: white;
}

.search-input:focus {
    outline: none;
    border-color: #791236;
    box-shadow: 0 0 0 3px rgba(121, 18, 54, 0.1);
}

/* Loading State */
.loading-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 60px 20px;
}

.loading-spinner {
    width: 40px;
    height: 40px;
    border: 4px solid #f3f3f3;
    border-top: 4px solid #791236;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 16px;
}

.loading-text {
    color: #666;
    font-size: 1.1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* Services Grid */
.services-main {
    max-width: 1200px;
    margin: 0 auto;
}

.services-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    gap: 24px;
    padding: 20px 0;
}

.service-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    transition: all 0.3s ease;
    cursor: pointer;
    border: 1px solid #f0f0f0;
}

.service-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
}

.card-image-container {
    position: relative;
    height: 200px;
    overflow: hidden;
}

.service-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.service-card:hover .service-image {
    transform: scale(1.05);
}

.image-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(121, 18, 54, 0.8);
    display: flex;
    align-items: center;
    justify-content: center;
    opacity: 0;
    transition: opacity 0.3s ease;
}

.service-card:hover .image-overlay {
    opacity: 1;
}

.view-details {
    color: white;
    font-weight: 600;
    font-size: 1rem;
}

.price-tag {
    position: absolute;
    top: 12px;
    right: 12px;
    background: rgba(255, 255, 255, 0.95);
    color: #791236;
    padding: 6px 12px;
    border-radius: 20px;
    font-weight: 700;
    font-size: 1.1rem;
    backdrop-filter: blur(10px);
}

.card-content {
    padding: 20px;
}

.service-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
}

.service-name {
    font-size: 1.3rem;
    font-weight: 700;
    color: #333;
    margin: 0;
    flex: 1;
    line-height: 1.3;
}

.duration-badge {
    display: flex;
    align-items: center;
    gap: 4px;
    background: #f8f9fa;
    color: #666;
    padding: 4px 8px;
    border-radius: 12px;
    font-size: 0.8rem;
    font-weight: 500;
    white-space: nowrap;
}

.service-description {
    color: #666;
    font-size: 0.95rem;
    line-height: 1.5;
    margin-bottom: 20px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
}

.service-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.provider-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.provider-avatar {
    width: 36px;
    height: 36px;
    background: linear-gradient(135deg, #791236, #553a6a);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 0.8rem;
    font-weight: 600;
}

.provider-details {
    display: flex;
    flex-direction: column;
}

.provider-name {
    font-weight: 600;
    color: #333;
    font-size: 0.9rem;
}

.provider-business {
    color: #666;
    font-size: 0.8rem;
}

.reserve-btn {
    background: linear-gradient(135deg, #791236, #a31d4a);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.reserve-btn:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(121, 18, 54, 0.3);
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 80px 20px;
    color: #666;
}

.empty-icon {
    font-size: 4rem;
    margin-bottom: 20px;
}

.empty-state h3 {
    color: #333;
    margin-bottom: 12px;
    font-size: 1.5rem;
}

.empty-state p {
    margin-bottom: 24px;
    font-size: 1.1rem;
}

.retry-btn {
    background: #791236;
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.3s ease;
}

.retry-btn:hover {
    background: #a31d4a;
}

/* Debug Panel */
.debug-floating {
    position: fixed;
    bottom: 20px;
    right: 20px;
    z-index: 1000;
}

.debug-toggle {
    background: #791236;
    color: white;
    border: none;
    width: 50px;
    height: 50px;
    border-radius: 50%;
    font-size: 1.2rem;
    cursor: pointer;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transition: all 0.3s ease;
}

.debug-toggle:hover {
    transform: scale(1.1);
}

.debug-panel {
    position: absolute;
    bottom: 60px;
    right: 0;
    background: white;
    border-radius: 12px;
    padding: 20px;
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
    min-width: 300px;
    max-width: 400px;
}

.debug-panel h4 {
    margin: 0 0 12px 0;
    color: #333;
}

.debug-panel pre {
    background: #f8f9fa;
    padding: 12px;
    border-radius: 6px;
    font-size: 0.8rem;
    max-height: 200px;
    overflow: auto;
    margin-bottom: 12px;
}

.debug-btn {
    background: #dc3545;
    color: white;
    border: none;
    padding: 8px 16px;
    border-radius: 6px;
    font-size: 0.9rem;
    cursor: pointer;
}

/* Responsive Design */
@media (max-width: 768px) {
    .services-page {
        padding: 16px;
    }
    
    .page-title {
        font-size: 2rem;
    }
    
    .header-actions {
        flex-direction: column;
        gap: 16px;
    }
    
    .search-section {
        max-width: 100%;
    }
    
    .services-grid {
        grid-template-columns: 1fr;
        gap: 16px;
    }
    
    .service-footer {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }
    
    .reserve-btn {
        width: 100%;
    }
}
</style>