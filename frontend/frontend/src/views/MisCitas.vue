<template>
    <div class="mis-citas-page">
        <!-- Header -->
        <header class="page-header">
            <div class="header-content">
                <button class="back-btn" @click="$router.back()">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <path d="M19 12H5"></path>
                        <path d="M12 19l-7-7 7-7"></path>
                    </svg>
                    Volver
                </button>
                <h1>Mis Citas</h1>
                <div class="header-actions">
                    <button class="refresh-btn" @click="cargarCitas" :disabled="loading">
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M23 4v6h-6"></path>
                            <path d="M1 20v-6h6"></path>
                            <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10"></path>
                            <path d="M20.49 15a9 9 0 0 1-14.85 3.36L1 14"></path>
                        </svg>
                        Actualizar
                    </button>
                </div>
            </div>
        </header>

        <!-- Filtros y estados -->
        <div class="filters-section">
            <div class="filter-tabs">
                <button 
                    v-for="filtro in filtros" 
                    :key="filtro.estado"
                    class="filter-tab"
                    :class="{ active: filtroActivo === filtro.estado }"
                    @click="cambiarFiltro(filtro.estado)"
                >
                    {{ filtro.nombre }}
                    <span class="badge">{{ filtro.contador }}</span>
                </button>
            </div>
        </div>

        <!-- Contenido principal -->
        <div class="citas-content">
            <!-- Loading state -->
            <div v-if="loading" class="loading-container">
                <div class="loading-spinner"></div>
                <p>Cargando tus citas...</p>
            </div>

            <!-- Citas encontradas -->
            <div v-else-if="citasFiltradas.length > 0" class="citas-list">
                <div class="citas-grid">
                    <div 
                        v-for="cita in citasFiltradas" 
                        :key="cita.id_cita"
                        class="cita-card"
                        :class="getCitaCardClass(cita)"
                    >
                        <div class="cita-header">
                            <div class="cita-status">
                                <span class="status-badge" :class="cita.estado">
                                    {{ getEstadoTexto(cita.estado) }}
                                </span>
                            </div>
                            <div class="cita-actions">
                                <button 
                                    v-if="cita.estado === 'activa'" 
                                    class="action-btn cancel"
                                    @click="cancelarCita(cita)"
                                    :disabled="procesandoCita"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M18 6L6 18"></path>
                                        <path d="M6 6l12 12"></path>
                                    </svg>
                                    Cancelar
                                </button>
                                <button 
                                    v-if="cita.estado === 'activa' && puedeReagendar(cita)"
                                    class="action-btn reschedule"
                                    @click="reagendarCita(cita)"
                                    :disabled="procesandoCita"
                                >
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                        <polyline points="14,2 14,8 20,8"></polyline>
                                        <path d="M16 13H8"></path>
                                        <path d="M16 17H8"></path>
                                        <path d="M10 9H8"></path>
                                    </svg>
                                    Reagendar
                                </button>
                            </div>
                        </div>

                        <div class="cita-body">
                            <div class="service-info">
                                <h3 class="service-name">{{ cita.servicio?.nombre || 'Servicio no disponible' }}</h3>
                                <p class="service-description" v-if="cita.servicio?.descripcion">
                                    {{ cita.servicio.descripcion }}
                                </p>
                            </div>

                            <div class="cita-details">
                                <div class="detail-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                                        <line x1="16" y1="2" x2="16" y2="6"></line>
                                        <line x1="8" y1="2" x2="8" y2="6"></line>
                                        <line x1="3" y1="10" x2="21" y2="10"></line>
                                    </svg>
                                    <span><strong>Fecha:</strong> {{ formatearFecha(cita.fecha) }}</span>
                                </div>
                                <div class="detail-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <polyline points="12 6 12 12 16 14"></polyline>
                                    </svg>
                                    <span><strong>Hora:</strong> {{ cita.hora }}</span>
                                </div>
                                <div class="detail-item">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                                    </svg>
                                    <span><strong>Precio:</strong> ${{ cita.servicio?.precio || 0 }} MXN</span>
                                </div>
                                <div class="detail-item" v-if="cita.mensaje">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"></path>
                                    </svg>
                                    <span><strong>Notas:</strong> {{ cita.mensaje }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="cita-footer">
                            <div class="cita-meta">
                                <span class="meta-item">Creado: {{ formatearFechaRelativa(cita.creado_en) }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Estado vacío -->
            <div v-else class="empty-state">
                <div class="empty-icon">📅</div>
                <h3>No tienes citas {{ filtroActivo !== 'todas' ? filtroActivo : '' }}</h3>
                <p v-if="filtroActivo === 'todas'">
                    ¡Agenda tu primera cita y aparecerá aquí!
                </p>
                <p v-else>
                    No hay citas con el estado "{{ getEstadoTexto(filtroActivo) }}"
                </p>
                <button class="btn-primary" @click="$router.push('/servicios')">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
                        <line x1="16" y1="2" x2="16" y2="6"></line>
                        <line x1="8" y1="2" x2="8" y2="6"></line>
                        <line x1="3" y1="10" x2="21" y2="10"></line>
                    </svg>
                    Explorar Servicios
                </button>
            </div>
        </div>

        <!-- Modal de Reagendar -->
        <div class="modal" v-if="showModalReagendar" @click="cerrarModalReagendar">
            <div class="modal-content" @click.stop>
                <h2>Reagendar Cita</h2>
                <h3>{{ citaSeleccionada?.servicio?.nombre }}</h3>
                
                <form @submit.prevent="confirmarReagendar" class="reschedule-form">
                    <div class="form-group">
                        <label for="nuevaFecha">Nueva Fecha</label>
                        <input 
                            type="date" 
                            id="nuevaFecha" 
                            v-model="reagendarForm.fecha"
                            :min="fechaMinima"
                            required
                            @change="cargarHorariosReagendar"
                        >
                    </div>

                    <div class="form-group">
                        <label for="nuevaHora">Nueva Hora</label>
                        <select 
                            id="nuevaHora" 
                            v-model="reagendarForm.hora"
                            required
                            :disabled="!horariosReagendar.length || loadingHorarios"
                        >
                            <option value="">Selecciona un horario</option>
                            <option 
                                v-for="horario in horariosReagendar" 
                                :key="horario"
                                :value="horario"
                            >
                                {{ horario }}
                            </option>
                        </select>
                        <span v-if="loadingHorarios" class="loading-text">Cargando horarios...</span>
                    </div>

                    <div class="form-actions">
                        <button type="button" class="btn-cancelar" @click="cerrarModalReagendar">Cancelar</button>
                        <button type="submit" class="btn-confirmar" :disabled="loadingHorarios || procesandoCita">
                            {{ procesandoCita ? 'Procesando...' : 'Confirmar Cambio' }}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'MisCitas',
    data() {
        return {
            citas: [],
            loading: false,
            filtroActivo: 'todas',
            procesandoCita: false,
            showModalReagendar: false,
            citaSeleccionada: null,
            reagendarForm: {
                fecha: '',
                hora: ''
            },
            horariosReagendar: [],
            loadingHorarios: false
        }
    },
    computed: {
        filtros() {
            const estados = {
                todas: { nombre: 'Todas', contador: this.citas.length },
                activa: { nombre: 'Activas', contador: this.citas.filter(c => c.estado === 'activa').length },
                completada: { nombre: 'Completadas', contador: this.citas.filter(c => c.estado === 'completada').length },
                cancelada: { nombre: 'Canceladas', contador: this.citas.filter(c => c.estado === 'cancelada').length }
            };
            return estados;
        },
        citasFiltradas() {
            if (this.filtroActivo === 'todas') {
                return this.citas;
            }
            return this.citas.filter(cita => cita.estado === this.filtroActivo);
        },
        fechaMinima() {
            return new Date().toISOString().split('T')[0];
        }
    },
    async mounted() {
        await this.cargarCitas();
        
        // Mostrar mensaje de éxito si viene de una reserva
        if (this.$route.query.success) {
            this.mostrarMensajeExito(this.$route.query.message);
        }
    },
    methods: {
        async cargarCitas() {
            this.loading = true;
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    this.$router.push('/login');
                    return;
                }

                const response = await fetch('http://localhost:4000/api/citas', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al cargar citas');
                }

                const citasData = await response.json();
                
                // Transformar datos para consistencia
                this.citas = citasData.map(cita => ({
                    ...cita,
                    servicio: {
                        nombre: cita.servicio,
                        descripcion: cita.descripcion,
                        precio: cita.precio
                    }
                })).sort((a, b) => new Date(`${a.fecha} ${a.hora}`) - new Date(`${b.fecha} ${b.hora}`));

            } catch (error) {
                console.error('Error cargando citas:', error);
                alert('Error al cargar tus citas. Por favor, intenta de nuevo.');
            } finally {
                this.loading = false;
            }
        },

        cambiarFiltro(estado) {
            this.filtroActivo = estado;
        },

        getEstadoTexto(estado) {
            const estados = {
                activa: 'Activa',
                completada: 'Completada',
                cancelada: 'Cancelada',
                pendiente: 'Pendiente'
            };
            return estados[estado] || estado;
        },

        getCitaCardClass(cita) {
            return {
                'activa': cita.estado === 'activa',
                'completada': cita.estado === 'completada',
                'cancelada': cita.estado === 'cancelada'
            };
        },

        formatearFecha(fecha) {
            return new Date(fecha).toLocaleDateString('es-ES', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
        },

        formatearFechaRelativa(fecha) {
            const ahora = new Date();
            const fechaCita = new Date(fecha);
            const diffTime = Math.abs(ahora - fechaCita);
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            
            if (diffDays === 1) return 'hace 1 día';
            if (diffDays < 7) return `hace ${diffDays} días`;
            if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semanas`;
            return `hace ${Math.floor(diffDays / 30)} meses`;
        },

        puedeReagendar(cita) {
            const fechaCita = new Date(`${cita.fecha} ${cita.hora}`);
            const ahora = new Date();
            // Permitir reagendar solo si la cita es en más de 2 horas
            return (fechaCita - ahora) > (2 * 60 * 60 * 1000);
        },

        async cancelarCita(cita) {
            if (!confirm('¿Estás seguro de que quieres cancelar esta cita?')) {
                return;
            }

            this.procesandoCita = true;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:4000/api/citas/${cita.id_cita}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Error al cancelar cita');
                }

                await this.cargarCitas();
                alert('Cita cancelada exitosamente');

            } catch (error) {
                console.error('Error cancelando cita:', error);
                alert('Error al cancelar la cita. Por favor, intenta de nuevo.');
            } finally {
                this.procesandoCita = false;
            }
        },

        async reagendarCita(cita) {
            this.citaSeleccionada = cita;
            this.reagendarForm = {
                fecha: cita.fecha,
                hora: cita.hora
            };
            this.showModalReagendar = true;
            await this.cargarHorariosReagendar();
        },

        async cargarHorariosReagendar() {
            if (!this.reagendarForm.fecha) return;

            this.loadingHorarios = true;
            try {
                const response = await fetch(
                    `http://localhost:4000/api/citas/disponibilidad/${this.citaSeleccionada.id_servicio}/${this.reagendarForm.fecha}`
                );

                if (!response.ok) {
                    throw new Error('Error al cargar horarios');
                }

                const horariosOcupados = await response.json();
                
                // Generar horarios disponibles
                const todosLosHorarios = [];
                for (let hora = 8; hora <= 20; hora++) {
                    todosLosHorarios.push(`${hora.toString().padStart(2, '0')}:00`);
                }

                this.horariosReagendar = todosLosHorarios.filter(
                    horario => !horariosOcupados.includes(horario) || horario === this.citaSeleccionada.hora
                );

            } catch (error) {
                console.error('Error cargando horarios:', error);
                // Fallback a horarios por defecto
                this.horariosReagendar = [
                    '09:00', '10:00', '11:00', '12:00',
                    '15:00', '16:00', '17:00', '18:00'
                ];
            } finally {
                this.loadingHorarios = false;
            }
        },

        async confirmarReagendar() {
            if (!this.reagendarForm.fecha || !this.reagendarForm.hora) {
                alert('Por favor selecciona fecha y hora');
                return;
            }

            this.procesandoCita = true;
            try {
                const token = localStorage.getItem('token');
                const response = await fetch(`http://localhost:4000/api/citas/${this.citaSeleccionada.id_cita}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        fecha: this.reagendarForm.fecha,
                        hora: this.reagendarForm.hora
                    })
                });

                if (!response.ok) {
                    const error = await response.text();
                    throw new Error(error || 'Error al reagendar cita');
                }

                await this.cargarCitas();
                this.cerrarModalReagendar();
                alert('Cita reagendada exitosamente');

            } catch (error) {
                console.error('Error reagendando cita:', error);
                alert(error.message || 'Error al reagendar la cita. Por favor, intenta de nuevo.');
            } finally {
                this.procesandoCita = false;
            }
        },

        cerrarModalReagendar() {
            this.showModalReagendar = false;
            this.citaSeleccionada = null;
            this.reagendarForm = { fecha: '', hora: '' };
            this.horariosReagendar = [];
        },

        mostrarMensajeExito(mensaje) {
            alert(mensaje || '¡Cita agendada correctamente!');
            // Limpiar query params
            this.$router.replace({ query: {} });
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
    --success: #38a169;
    --warning: #d69e2e;
    --error: #e53e3e;
}

/* ========== LAYOUT PRINCIPAL ========== */
.mis-citas-page {
    min-height: 100vh;
    background: var(--background);
    padding-bottom: 2rem;
}

/* ========== HEADER ========== */
.page-header {
    background: var(--surface);
    box-shadow: 0 2px 10px var(--shadow);
    margin-bottom: 2rem;
}

.header-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    max-width: 1200px;
    margin: 0 auto;
    padding: 1.5rem 2rem;
}

.header-content h1 {
    font-size: 2rem;
    font-weight: 800;
    color: var(--text);
    margin: 0;
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

.refresh-btn {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--primary);
    color: white;
    border: none;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
    background: var(--primary-light);
}

.refresh-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* ========== FILTROS ========== */
.filters-section {
    max-width: 1200px;
    margin: 0 auto 2rem;
    padding: 0 2rem;
}

.filter-tabs {
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
}

.filter-tab {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--surface);
    border: 2px solid var(--border);
    color: var(--text);
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.filter-tab.active {
    background: var(--primary);
    border-color: var(--primary);
    color: white;
}

.filter-tab:hover:not(.active) {
    border-color: var(--primary);
}

.badge {
    background: var(--primary-light);
    color: white;
    padding: 0.25rem 0.5rem;
    border-radius: 10px;
    font-size: 0.8rem;
    font-weight: 700;
}

.filter-tab.active .badge {
    background: rgba(255, 255, 255, 0.2);
}

/* ========== CONTENIDO PRINCIPAL ========== */
.citas-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

/* ========== LOADING STATE ========== */
.loading-container {
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

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

/* ========== LISTA DE CITAS ========== */
.citas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
    gap: 1.5rem;
}

.cita-card {
    background: var(--surface);
    border-radius: 16px;
    padding: 1.5rem;
    box-shadow: 0 4px 15px var(--shadow);
    border: 2px solid transparent;
    transition: all 0.3s ease;
}

.cita-card.activa {
    border-left: 4px solid var(--success);
}

.cita-card.completada {
    border-left: 4px solid var(--primary);
    opacity: 0.8;
}

.cita-card.cancelada {
    border-left: 4px solid var(--error);
    opacity: 0.6;
}

.cita-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px var(--shadow);
}

/* ========== HEADER DE CITA ========== */
.cita-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;
}

.status-badge {
    padding: 0.375rem 0.75rem;
    border-radius: 20px;
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
}

.status-badge.activa {
    background: #c6f6d5;
    color: #22543d;
}

.status-badge.completada {
    background: #bee3f8;
    color: #1a365d;
}

.status-badge.cancelada {
    background: #fed7d7;
    color: #742a2a;
}

.cita-actions {
    display: flex;
    gap: 0.5rem;
}

.action-btn {
    display: flex;
    align-items: center;
    gap: 0.375rem;
    padding: 0.5rem 0.75rem;
    border: none;
    border-radius: 8px;
    font-size: 0.85rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.action-btn.cancel {
    background: #fed7d7;
    color: #c53030;
}

.action-btn.cancel:hover:not(:disabled) {
    background: #feb2b2;
}

.action-btn.reschedule {
    background: #e6fffa;
    color: #234e52;
}

.action-btn.reschedule:hover:not(:disabled) {
    background: #b2f5ea;
}

.action-btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

/* ========== CUERPO DE CITA ========== */
.cita-body {
    margin-bottom: 1rem;
}

.service-name {
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--text);
    margin: 0 0 0.5rem 0;
}

.service-description {
    color: var(--text-light);
    font-size: 0.9rem;
    margin: 0 0 1rem 0;
    line-height: 1.4;
}

.cita-details {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
}

.detail-item svg {
    color: var(--primary);
    flex-shrink: 0;
}

/* ========== FOOTER DE CITA ========== */
.cita-footer {
    border-top: 1px solid var(--border);
    padding-top: 1rem;
}

.cita-meta {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.meta-item {
    font-size: 0.8rem;
    color: var(--text-light);
}

/* ========== ESTADO VACÍO ========== */
.empty-state {
    text-align: center;
    padding: 4rem 2rem;
    background: var(--surface);
    border-radius: 16px;
    border: 2px dashed var(--border);
}

.empty-icon {
    font-size: 4rem;
    margin-bottom: 1rem;
}

.empty-state h3 {
    font-size: 1.5rem;
    color: var(--text);
    margin: 0 0 0.5rem 0;
}

.empty-state p {
    color: var(--text-light);
    margin: 0 0 1.5rem 0;
}

.btn-primary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: var(--primary);
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-primary:hover {
    background: var(--primary-light);
    transform: translateY(-2px);
}

/* ========== MODAL REAGENDAR ========== */
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

.reschedule-form {
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
.form-group select {
    padding: 0.75rem;
    border: 2px solid var(--border);
    border-radius: 10px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--shadow);
}

.loading-text {
    color: var(--text-light);
    font-size: 0.9rem;
    font-style: italic;
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

.btn-confirmar:hover:not(:disabled) {
    background: var(--primary-light);
}

.btn-confirmar:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

/* ========== RESPONSIVE ========== */
@media (max-width: 768px) {
    .header-content {
        padding: 1rem;
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }

    .filters-section,
    .citas-content {
        padding: 0 1rem;
    }

    .citas-grid {
        grid-template-columns: 1fr;
    }

    .cita-header {
        flex-direction: column;
        gap: 1rem;
    }

    .cita-actions {
        width: 100%;
        justify-content: flex-end;
    }

    .filter-tabs {
        justify-content: center;
    }

    .form-actions {
        flex-direction: column;
    }
}

@media (max-width: 480px) {
    .header-content h1 {
        font-size: 1.5rem;
    }

    .cita-card {
        padding: 1rem;
    }

    .modal-content {
        padding: 1.5rem;
        margin: 1rem;
    }
}
</style>