<template>
    <div class="service-detail-page">
        <!-- Header con navegación -->
        <header class="detail-header">
            <div class="header-content">
                <button class="back-btn" @click="$router.back()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M19 12H5"></path>
                        <path d="M12 19l-7-7 7-7"></path>
                    </svg>
                    Volver
                </button>
                <h1 class="page-title">Detalle del Servicio</h1>
                <div class="header-actions">
                    <button class="favorite-btn">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </header>

        <!-- Contenido principal -->
        <div class="detail-content" v-if="!loading && servicio">
            <!-- Galería de imágenes -->
            <div class="service-gallery">
                <div class="main-image">
                    <img 
                        :src="getImageUrl(servicio.imagen_referencia)" 
                        :alt="servicio.nombre"
                        @error="handleImageError"
                        class="service-image"
                    />
                </div>
                <!-- Mini galería -->
                <div class="image-thumbnails" v-if="servicio.imagen_referencia">
                    <div class="thumbnail active">
                        <img :src="getImageUrl(servicio.imagen_referencia)" :alt="servicio.nombre" />
                    </div>
                </div>
            </div>

            <!-- Información del servicio -->
            <div class="service-info">
                <div class="service-header">
                    <div class="service-meta">
                        <span class="service-category">Belleza & Estética</span>
                        <div class="rating">
                            <span class="stars">★★★★★</span>
                            <span class="rating-text">(5.0)</span>
                        </div>
                    </div>
                    <h1 class="service-title">{{ servicio.nombre }}</h1>
                    <p class="service-price">${{ servicio.precio }} MXN</p>
                </div>

                <!-- Información detallada -->
                <div class="service-details">
                    <div class="detail-item">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                        </svg>
                        <span><strong>Duración:</strong> {{ servicio.duracion }} minutos</span>
                    </div>
                    
                    <div class="detail-item">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                        </svg>
                        <span><strong>Disponibilidad:</strong> Inmediata</span>
                    </div>
                </div>

                <!-- Descripción -->
                <div class="description-section">
                    <h3>Descripción del Servicio</h3>
                    <p class="service-description">{{ servicio.descripcion }}</p>
                </div>

                <!-- Información del proveedor -->
                <div class="provider-section">
                    <h3>Acerca del Proveedor</h3>
                    <div class="provider-card">
                        <div class="provider-avatar">
                            {{ getInitials(servicio.nombre_proveedor) }}
                        </div>
                        <div class="provider-info">
                            <h4 class="provider-name">{{ servicio.nombre_proveedor }}</h4>
                            <p class="provider-business">{{ servicio.nombre_emprendimiento }}</p>
                            <div class="provider-stats">
                                <span class="stat">⭐ 5.0 (50 reseñas)</span>
                                <span class="stat">📍 Oaxaca Centro</span>
                            </div>
                        </div>
                        <button class="contact-btn">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                            </svg>
                            Contactar
                        </button>
                    </div>
                </div>

                <!-- Reseñas -->
                <div class="reviews-section">
                    <h3>Reseñas y Calificaciones</h3>
                    <div class="reviews-placeholder">
                        <p>Este servicio aún no tiene reseñas. ¡Sé el primero en opinar!</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- Barra de acciones fija -->
        <div class="action-bar" v-if="servicio">
            <div class="price-display">
                <span class="price">${{ servicio.precio }}</span>
                <span class="price-note">por servicio</span>
            </div>
            <button class="reserve-btn" @click="iniciarReserva">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                    <line x1="16" y1="2" x2="16" y2="6"></line>
                    <line x1="8" y1="2" x2="8" y2="6"></line>
                    <line x1="3" y1="10" x2="21" y2="10"></line>
                </svg>
                Reservar Ahora
            </button>
        </div>

        <!-- Loading state -->
        <div v-if="loading" class="loading-container">
            <div class="loading-spinner"></div>
            <p>Cargando servicio...</p>
        </div>

        <!-- Error state -->
        <div v-if="error" class="error-container">
            <div class="error-icon">⚠️</div>
            <h3>Servicio no encontrado</h3>
            <p>{{ errorMessage }}</p>
            <button class="retry-btn" @click="cargarServicio">Reintentar</button>
        </div>

        <!-- Modal de Reserva -->
        <div class="modal" v-if="showModalCita" @click="cerrarModal">
            <div class="modal-content" @click.stop>
                <h2>Agendar Cita</h2>
                <h3>{{ servicio?.nombre }}</h3>
                
                <form @submit.prevent="reservarCita" class="reservation-form">
                    <div class="form-group">
                        <label for="fecha">Fecha</label>
                        <input 
                            type="date" 
                            id="fecha" 
                            v-model="citaForm.fecha"
                            :min="fechaMinima"
                            required
                            @change="cargarHorariosDisponibles"
                        >
                    </div>

                    <div class="form-group">
                        <label for="hora">Hora</label>
                        <select 
                            id="hora" 
                            v-model="citaForm.hora"
                            required
                            :disabled="!horariosDisponibles.length || loadingHorarios"
                        >
                            <option value="">Selecciona un horario</option>
                            <option 
                                v-for="horario in horariosDisponibles" 
                                :key="horario"
                                :value="horario"
                            >
                                {{ horario }}
                            </option>
                        </select>
                        <span v-if="loadingHorarios" class="loading-text">Cargando horarios...</span>
                        <span v-if="errorHorarios" class="error-text">{{ errorHorarios }}</span>
                    </div>

                    <div class="form-group">
                        <label for="mensaje">Mensaje (opcional)</label>
                        <textarea 
                            id="mensaje" 
                            v-model="citaForm.mensaje"
                            rows="3"
                            placeholder="Agrega cualquier detalle o petición especial..."
                        ></textarea>
                    </div>

                    <div class="reservation-summary">
                        <div class="summary-item">
                            <span>Duración:</span>
                            <strong>{{ servicio?.duracion }} minutos</strong>
                        </div>
                        <div class="summary-item">
                            <span>Precio:</span>
                            <strong>${{ servicio?.precio }} MXN</strong>
                        </div>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn-cancelar" @click="cerrarModal">Cancelar</button>
                        <button type="submit" class="btn-confirmar" :disabled="loadingHorarios">
                            Confirmar Reserva
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import { useAuthStore } from '../store';
import { mapState } from 'pinia';

export default {
    name: 'DetalleServicio',
    data() {
        return {
            servicio: null,
            loading: true,
            error: false,
            errorMessage: '',
            showModalCita: false,
            citaForm: {
                fecha: '',
                hora: '',
                mensaje: ''
            },
            horariosDisponibles: [],
            loadingHorarios: false,
            errorHorarios: null
        }
    },
    computed: {
        ...mapState(useAuthStore, ['userName'])
    },
    async mounted() {
        await this.cargarServicio();
    },
    methods: {
        async cargarServicio() {
    this.loading = true;
    this.error = false;
    this.errorMessage = '';
    
    try {
        const servicioId = this.$route.params.id;
        console.log('🔄 Cargando servicio ID:', servicioId);
        
        // 🔥 AHORA ESTE ENDPOINT DEBERÍA FUNCIONAR
        const response = await fetch(`http://localhost:4000/api/servicios/detalle/${servicioId}`);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        // 🔥 RECIBIMOS UN OBJETO INDIVIDUAL
        const servicioData = await response.json();
        console.log('✅ Servicio cargado:', servicioData);
        
        // Transformar datos
        this.servicio = {
            id_servicio: servicioData.id_servicio,
            nombre: servicioData.nombre,
            descripcion: servicioData.descripcion,
            precio: servicioData.precio,
            duracion: servicioData.duracion,
            imagen_referencia: servicioData.imagen_referencia,
            nombre_proveedor: servicioData.proveedor?.nombre || 'Proveedor',
            nombre_emprendimiento: servicioData.emprendimiento?.nombre || 'Emprendimiento',
            emprendimiento: servicioData.emprendimiento,
            proveedor: servicioData.proveedor
        };
        
    } catch (error) {
        console.error('❌ Error cargando servicio:', error);
        this.error = true;
        this.errorMessage = error.message;
        
        // Fallback temporal
        await this.cargarServicioEjemplo();
    } finally {
        this.loading = false;
    }
},

        // 🆕 Método temporal para datos de ejemplo
        async cargarServicioEjemplo() {
            try {
                // Primero intenta cargar desde el endpoint público
                const response = await fetch('http://localhost:4000/api/servicios/public/todos');
                if (response.ok) {
                    const servicios = await response.json();
                    const servicioEncontrado = servicios.find(s => s.id_servicio == this.$route.params.id);
                    
                    if (servicioEncontrado) {
                        this.servicio = servicioEncontrado;
                        return;
                    }
                }
                
                // Si no encuentra, usar datos hardcodeados
                this.servicio = {
                    id_servicio: this.$route.params.id,
                    nombre: 'Corte de Cabello Premium',
                    descripcion: 'Corte de cabello profesional con técnicas modernas y productos de alta calidad. Incluye lavado, corte y peinado final.',
                    precio: 250,
                    duracion: 60,
                    imagen_referencia: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop',
                    nombre_proveedor: 'María González',
                    nombre_emprendimiento: 'Salón Belleza Oaxaqueña'
                };
                
            } catch (error) {
                console.error('Error cargando servicio de ejemplo:', error);
                this.errorMessage = 'No se pudo cargar el servicio. Verifica tu conexión.';
            }
        },

        // 🆕 MÉTODO PARA MANEJAR IMÁGENES (igual que en Servicios.vue)
        getImageUrl(imagePath) {
            if (!imagePath) {
                return this.getDefaultImage();
            }
            
            if (imagePath.startsWith('http')) {
                return imagePath;
            }
            
            if (imagePath.startsWith('/')) {
                return imagePath;
            }
            
            if (imagePath.includes('upload')) {
                return `https://res.cloudinary.com/${imagePath}`;
            }
            
            return this.getDefaultImage();
        },

        getDefaultImage() {
            return 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop';
        },

        handleImageError(event) {
            console.warn('❌ Error cargando imagen:', event.target.src);
            event.target.src = this.getDefaultImage();
            event.target.onerror = null;
        },

        getInitials(nombre) {
            return nombre
                ?.split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .substring(0, 2) || 'PR';
        },

        iniciarReserva() {
            if (!this.servicio) return;
            this.showModalCita = true;
            this.citaForm = {
                fecha: '',
                hora: '',
                mensaje: ''
            };
        },

        cerrarModal() {
            this.showModalCita = false;
            this.errorHorarios = null;
        },

        async cargarHorariosDisponibles() {
            if (!this.citaForm.fecha) return;

            this.loadingHorarios = true;
            this.errorHorarios = null;
            this.horariosDisponibles = [];

            try {
                // Obtener citas existentes para este servicio en la fecha seleccionada
                const response = await fetch(`http://localhost:4000/api/citas/disponibilidad/${this.servicio.id_servicio}/${this.citaForm.fecha}`);
                
                if (!response.ok) {
                    throw new Error('Error al cargar horarios disponibles');
                }

                const citasOcupadas = await response.json();
                
                // Generar horarios disponibles (8:00 AM a 8:00 PM)
                const horarios = [];
                for (let hora = 8; hora < 20; hora++) {
                    const horaStr = `${hora.toString().padStart(2, '0')}:00`;
                    if (!citasOcupadas.includes(horaStr)) {
                        horarios.push(horaStr);
                    }
                }

                this.horariosDisponibles = horarios;
                
                if (horarios.length === 0) {
                    this.errorHorarios = 'No hay horarios disponibles para esta fecha';
                }

            } catch (error) {
                console.error('Error al cargar horarios:', error);
                this.errorHorarios = 'Error al cargar los horarios disponibles';
                
                // Temporalmente, mientras se implementa el endpoint:
                this.horariosDisponibles = [
                    '09:00', '10:00', '11:00', '12:00',
                    '15:00', '16:00', '17:00', '18:00'
                ];
            } finally {
                this.loadingHorarios = false;
            }
        },

        async reservarCita() {
            if (!this.servicio || !this.citaForm.fecha || !this.citaForm.hora) return;

            try {
                const response = await fetch('http://localhost:4000/api/citas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: JSON.stringify({
                        id_servicio: this.servicio.id_servicio,
                        fecha: this.citaForm.fecha,
                        hora: this.citaForm.hora,
                        mensaje: this.citaForm.mensaje
                    })
                });

                if (!response.ok) {
                    const error = await response.text();
                    throw new Error(error || 'Error al crear la cita');
                }

                const cita = await response.json();
                this.showModalCita = false;
                
                // Redireccionar a la página de citas del usuario
                this.$router.push({
                    path: '/mis-citas',
                    query: { success: 'true', message: '¡Cita agendada correctamente!' }
                });

            } catch (error) {
                console.error('Error al reservar cita:', error);
                alert(error.message || 'Error al reservar la cita. Por favor, intenta de nuevo.');
            }
        }
    },
    watch: {
        '$route.params.id': {
            handler() {
                this.cargarServicio();
            },
            immediate: true
        }
    }
}
</script>

<style scoped>
/* ========== VARIABLES ========== */
:root {
    --primary: #791236;
    --primary-light: #a31d4a;
    --background: #fef7fa;
    --surface: #ffffff;
    --text: #2d3748;
    --text-light: #718096;
    --border: #e2e8f0;
    --shadow: rgba(121, 18, 54, 0.1);
}

/* ========== LAYOUT PRINCIPAL ========== */
.service-detail-page {
    min-height: 100vh;
    background: var(--background);
    padding-bottom: 100px;
}

/* ========== HEADER ========== */
.detail-header {
    background: var(--surface);
    box-shadow: 0 2px 10px var(--shadow);
    position: sticky;
    top: 0;
    z-index: 100;
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1rem 2rem;
}

.back-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: 2px solid var(--primary);
    color: var(--primary);
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.back-btn:hover {
    background: var(--primary);
    color: white;
}

.page-title {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text);
    margin: 0;
}

.favorite-btn {
    background: none;
    border: none;
    padding: 0.5rem;
    cursor: pointer;
    color: var(--text-light);
    transition: color 0.3s ease;
}

.favorite-btn:hover {
    color: var(--primary);
}

/* ========== CONTENIDO PRINCIPAL ========== */
.detail-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
}

/* ========== GALERÍA ========== */
.service-gallery {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.main-image {
    width: 100%;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 8px 30px var(--shadow);
}

.main-image img {
    width: 100%;
    height: 400px;
    object-fit: cover;
    background: linear-gradient(135deg, #f5f5f5 0%, #e0e0e0 100%);
}

.image-thumbnails {
    display: flex;
    gap: 0.5rem;
}

.thumbnail {
    width: 80px;
    height: 80px;
    border-radius: 12px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    transition: all 0.3s ease;
}

.thumbnail.active {
    border-color: var(--primary);
}

.thumbnail img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

/* ========== INFORMACIÓN DEL SERVICIO ========== */
.service-info {
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

.service-header {
    border-bottom: 1px solid var(--border);
    padding-bottom: 1.5rem;
}

.service-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.5rem;
}

.service-category {
    background: var(--primary);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 600;
}

.rating {
    display: flex;
    align-items: center;
    gap: 0.5rem;
}

.stars {
    color: #ffc107;
    font-size: 1rem;
}

.rating-text {
    color: var(--text-light);
    font-size: 0.9rem;
}

.service-title {
    font-size: 2rem;
    font-weight: 800;
    color: var(--text);
    margin: 0.5rem 0;
    line-height: 1.2;
}

.service-price {
    font-size: 2.5rem;
    font-weight: 800;
    color: var(--primary);
    margin: 0;
}

/* ========== DETALLES ========== */
.service-details {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    padding: 0.75rem;
    background: var(--surface);
    border-radius: 12px;
    border: 1px solid var(--border);
}

.detail-item svg {
    color: var(--primary);
}

/* ========== DESCRIPCIÓN ========== */
.description-section h3,
.provider-section h3,
.reviews-section h3 {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text);
    margin-bottom: 1rem;
}

.service-description {
    color: var(--text-light);
    line-height: 1.6;
    font-size: 1rem;
}

/* ========== PROVEEDOR ========== */
.provider-card {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1.5rem;
    background: var(--surface);
    border-radius: 16px;
    border: 1px solid var(--border);
    box-shadow: 0 4px 15px var(--shadow);
}

.provider-avatar {
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, var(--primary), #553a6a);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 1.2rem;
    flex-shrink: 0;
}

.provider-info {
    flex: 1;
}

.provider-name {
    font-size: 1.1rem;
    font-weight: 700;
    color: var(--text);
    margin: 0 0 0.25rem 0;
}

.provider-business {
    color: var(--text-light);
    margin: 0 0 0.5rem 0;
}

.provider-stats {
    display: flex;
    gap: 1rem;
}

.stat {
    font-size: 0.85rem;
    color: var(--text-light);
}

.contact-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--primary);
    color: white;
    border: none;
    padding: 0.75rem 1.25rem;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.contact-btn:hover {
    background: var(--primary-light);
    transform: translateY(-2px);
}

/* ========== RESEÑAS ========== */
.reviews-placeholder {
    text-align: center;
    padding: 3rem 2rem;
    background: var(--surface);
    border-radius: 16px;
    border: 2px dashed var(--border);
    color: var(--text-light);
}

/* ========== ACTION BAR ========== */
.action-bar {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--surface);
    box-shadow: 0 -4px 20px var(--shadow);
    padding: 1rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 100;
}

.price-display {
    text-align: left;
}

.price {
    font-size: 2rem;
    font-weight: 800;
    color: var(--primary);
    display: block;
}

.price-note {
    font-size: 0.9rem;
    color: var(--text-light);
}

.reserve-btn {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    background: linear-gradient(135deg, var(--primary), var(--primary-light));
    color: white;
    border: none;
    padding: 1rem 2rem;
    border-radius: 16px;
    font-size: 1.1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
    box-shadow: 0 4px 20px var(--shadow);
}

.reserve-btn:hover {
    transform: translateY(-3px);
    box-shadow: 0 8px 30px var(--shadow);
}

/* ========== LOADING & ERROR STATES ========== */
.loading-container,
.error-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 4rem 2rem;
    text-align: center;
}

.loading-spinner {
    width: 50px;
    height: 50px;
    border: 4px solid rgba(121, 18, 54, 0.1);
    border-top: 4px solid var(--primary);
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 1rem;
}

.error-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
}

.retry-btn {
    background: var(--primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    margin-top: 1rem;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* ========== MODAL DE RESERVA ========== */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 1rem;
}

.modal-content {
    background: white;
    border-radius: 20px;
    padding: 2rem;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    max-height: 90vh;
    overflow-y: auto;
}

.modal-content h2 {
    color: var(--text);
    margin: 0 0 0.5rem;
    font-size: 1.5rem;
}

.modal-content h3 {
    color: var(--primary);
    margin: 0 0 1.5rem;
    font-size: 1.2rem;
}

.reservation-form {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.form-group label {
    font-weight: 600;
    color: var(--text);
}

.form-group input,
.form-group select,
.form-group textarea {
    padding: 0.75rem;
    border: 2px solid var(--border);
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--shadow);
}

.form-group textarea {
    resize: vertical;
    min-height: 100px;
}

.loading-text {
    color: var(--text-light);
    font-size: 0.9rem;
    font-style: italic;
}

.error-text {
    color: #e53e3e;
    font-size: 0.9rem;
}

.reservation-summary {
    background: var(--background);
    padding: 1rem;
    border-radius: 12px;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.summary-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 0.95rem;
}

.form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.btn-cancelar,
.btn-confirmar {
    flex: 1;
    padding: 1rem;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-cancelar {
    background: none;
    border: 2px solid var(--border);
    color: var(--text);
}

.btn-confirmar {
    background: var(--primary);
    border: none;
    color: white;
}

.btn-cancelar:hover {
    background: var(--border);
}

.btn-confirmar:hover {
    background: var(--primary-light);
}

.btn-confirmar:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

/* ========== RESPONSIVE ========== */
@media (max-width: 968px) {
    .detail-content {
        grid-template-columns: 1fr;
        gap: 2rem;
        padding: 1.5rem;
    }
    
    .service-title {
        font-size: 1.75rem;
    }
    
    .service-price {
        font-size: 2rem;
    }
}

@media (max-width: 768px) {
    .header-content {
        padding: 1rem;
    }
    
    .detail-content {
        padding: 1rem;
    }
    
    .provider-card {
        flex-direction: column;
        text-align: center;
    }
    
    .provider-stats {
        justify-content: center;
    }
    
    .action-bar {
        padding: 1rem;
    }
    
    .price {
        font-size: 1.75rem;
    }
    
    .reserve-btn {
        padding: 0.875rem 1.5rem;
        font-size: 1rem;
    }
}

@media (max-width: 480px) {
    .page-title {
        display: none;
    }
    
    .service-title {
        font-size: 1.5rem;
    }
    
    .service-price {
        font-size: 1.75rem;
    }
}
</style>