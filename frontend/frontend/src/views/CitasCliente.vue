<template> 
    <div class="citas-page">
        <HeaderServicios />

        <div class="citas-container">
            <h1 class="page-title">📅 Mis citas</h1>

            <!-- Cargando -->
            <div v-if="cargando" class="cargando">
                <p>Cargando tus citas...</p>
            </div>

            <!-- Lista de citas -->
            <div v-else-if="citas.length > 0" class="citas-grid">
                <div 
                    v-for="cita in citas" 
                    :key="cita.id_cita"
                    class="cita-card"
                    :class="`estado-${cita.estado}`"
                >
                    <div class="cita-estado">
                        <span class="badge-estado">{{ formatearEstado(cita.estado) }}</span>
                    </div>

                    <div class="cita-info">
                        <h3 class="cita-servicio">{{ cita.servicio }}</h3>
                        <p class="cita-emprendimiento">📍 {{ cita.emprendimiento }}</p>
                        
                        <div class="cita-detalles">
                            <div class="detalle-item">
                                <span class="icono">📅</span>
                                <span>{{ formatearFecha(cita.fecha) }}</span>
                            </div>
                            <div class="detalle-item">
                                <span class="icono">🕒</span>
                                <span>{{ cita.hora }}</span>
                            </div>
                            <div class="detalle-item">
                                <span class="icono">⏱️</span>
                                <span>{{ cita.duracion }} min</span>
                            </div>
                            <div class="detalle-item">
                                <span class="icono">💰</span>
                                <span>${{ cita.precio }}</span>
                            </div>
                        </div>

                        <div v-if="cita.notas" class="cita-notas">
                            <strong>Notas:</strong> {{ cita.notas }}
                        </div>

                        <div class="cita-acciones">
                            <button 
                                v-if="cita.estado === 'pendiente'" 
                                @click="cancelarCita(cita.id_cita)"
                                class="btn-cancelar-cita"
                            >
                                ❌ Cancelar cita
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Sin citas -->
            <div v-else class="sin-citas">
                <p>📭 No tienes citas agendadas</p>
                <router-link to="/servicios" class="btn-buscar-servicios">
                    Ver servicios disponibles
                </router-link>
            </div>
        </div>
    </div>
</template>

<script>
import HeaderServicios from '../components/HeaderServicios.vue';

export default {
    name: "CitasCliente",
    components: {
        HeaderServicios
    },
    data() {
        return {
            citas: [],
            cargando: true
        }
    },
    mounted() {
        this.cargarCitas();
    },
    methods: {
        async cargarCitas() {
            try {
                this.cargando = true;
                const token = localStorage.getItem('token');

                if (!token) {
                    this.$router.push('/login');
                    return;
                }

                const respuesta = await fetch('http://localhost:4000/api/citas', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!respuesta.ok) throw new Error('Error al cargar citas');

                const data = await respuesta.json();
                this.citas = data;
                console.log('✅ Citas cargadas:', this.citas);

            } catch (error) {
                console.error('❌ Error:', error);
                alert('Error al cargar tus citas');
            } finally {
                this.cargando = false;
            }
        },

        async cancelarCita(id) {
            if (!confirm('¿Estás seguro de cancelar esta cita?')) return;

            try {
                const token = localStorage.getItem('token');
                const respuesta = await fetch(`http://localhost:4000/api/citas/${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!respuesta.ok) throw new Error('Error al cancelar');

                alert('Cita cancelada exitosamente');
                this.cargarCitas(); // Recargar lista

            } catch (error) {
                console.error('❌ Error:', error);
                alert('Error al cancelar la cita');
            }
        },

        formatearFecha(fecha) {
            const f = new Date(fecha);
            const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            return f.toLocaleDateString('es-MX', opciones);
        },

        formatearEstado(estado) {
            const estados = {
                'pendiente': '⏳ Pendiente',
                'confirmada': '✅ Confirmada',
                'cancelada': '❌ Cancelada',
                'completada': '✔️ Completada'
            };
            return estados[estado] || estado;
        }
    }
}
</script>

<style scoped>
.citas-page {
    min-height: 100vh;
    background: #F3EDFF;
}

.citas-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
}

.page-title {
    font-size: 2.5rem;
    color: #8B5FBF;
    margin-bottom: 40px;
    text-align: center;
}

/* Grid de citas */
.citas-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    gap: 25px;
}

.cita-card {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(139, 95, 191, 0.15);
    transition: all 0.3s ease;
    border-left: 5px solid #8B5FBF;
}

.cita-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(139, 95, 191, 0.25);
}

/* Estados */
.estado-pendiente { border-left-color: #FFA726; }
.estado-confirmada { border-left-color: #66BB6A; }
.estado-cancelada { border-left-color: #EF5350; }
.estado-completada { border-left-color: #42A5F5; }

.cita-estado {
    padding: 15px 20px;
    background: #F3EDFF;
}

.badge-estado {
    display: inline-block;
    padding: 6px 12px;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
    background: #8B5FBF;
    color: white;
}

.cita-info {
    padding: 20px;
}

.cita-servicio {
    font-size: 1.4rem;
    color: #8B5FBF;
    margin-bottom: 8px;
}

.cita-emprendimiento {
    color: #666;
    margin-bottom: 20px;
}

.cita-detalles {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 15px;
}

.detalle-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    background: #F9F9F9;
    border-radius: 8px;
}

.detalle-item .icono {
    font-size: 1.2rem;
}

.cita-notas {
    background: #FFF9C4;
    padding: 12px;
    border-radius: 8px;
    border-left: 3px solid #FBC02D;
    margin-bottom: 15px;
    font-size: 0.95rem;
}

.cita-acciones {
    display: flex;
    gap: 10px;
}

.btn-cancelar-cita {
    flex: 1;
    padding: 10px 20px;
    background: #EF5350;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-cancelar-cita:hover {
    background: #E53935;
    transform: scale(1.02);
}

/* Estados */
.cargando, .sin-citas {
    text-align: center;
    padding: 80px 20px;
}

.cargando p, .sin-citas p {
    font-size: 1.5rem;
    color: #666;
    margin-bottom: 20px;
}

.btn-buscar-servicios {
    display: inline-block;
    padding: 15px 30px;
    background: #8B5FBF;
    color: white;
    text-decoration: none;
    border-radius: 50px;
    font-weight: 700;
    transition: all 0.3s ease;
}

.btn-buscar-servicios:hover {
    background: #CAA6F7;
    transform: scale(1.05);
}

/* Responsive */
@media (max-width: 768px) {
    .citas-grid {
        grid-template-columns: 1fr;
    }

    .cita-detalles {
        grid-template-columns: 1fr;
    }
}
</style>