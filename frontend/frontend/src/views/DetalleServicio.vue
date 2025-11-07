<template>
    <div class="detalle-page">
        <HeaderServicios />
        
        <!-- Cargando -->
        <div v-if="cargando" class="cargando">
            <p>Cargando servicio...</p>
        </div>

        <!-- Contenido del servicio -->
        <div v-else-if="servicio" class="detalle-container">
            <!-- Imagen del servicio -->
            <div class="detalle-imagen">
                <img 
                    :src="servicio.imagen || '/src/images/default-service.jpg'" 
                    :alt="servicio.nombre"
                />
            </div>

            <!-- Información del servicio -->
            <div class="detalle-info">
                <h1 class="servicio-titulo">{{ servicio.nombre }}</h1>
                
                <div class="servicio-emprendimiento">
                    <span class="icono">📍</span>
                    <span class="nombre-negocio">{{ servicio.nombre_emprendimiento }}</span>
                </div>

                <div class="servicio-precio-duracion">
                    <div class="precio-box">
                        <span class="label">Precio</span>
                        <span class="valor">${{ servicio.precio }}</span>
                    </div>
                    <div class="duracion-box">
                        <span class="label">Duración</span>
                        <span class="valor">{{ servicio.duracion }} min</span>
                    </div>
                </div>

                <div class="servicio-descripcion">
                    <h3>Descripción</h3>
                    <p>{{ servicio.descripcion }}</p>
                </div>

                <div class="servicio-ubicacion">
                    <h3>Ubicación</h3>
                    <p>{{ servicio.direccion || 'Dirección no disponible' }}</p>
                </div>

                <!-- Botón de agendar -->
                <button @click="mostrarModal = true" class="btn-agendar">
                    📅 Agendar cita
                </button>

                <button @click="volver" class="btn-volver">
                    ← Volver a servicios
                </button>
            </div>
        </div>

        <!-- Error -->
        <div v-else class="error">
            <p>Servicio no encontrado</p>
            <button @click="volver" class="btn-volver">Volver</button>
        </div>

        <!-- ✅ MODAL DE RESERVA -->
        <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
            <div class="modal-content">
                <div class="modal-header">
                    <h2>Reservar cita</h2>
                    <button @click="cerrarModal" class="btn-cerrar-modal">✕</button>
                </div>

                <div class="modal-body">
                    <!-- Resumen del servicio -->
                    <div class="resumen-servicio">
                        <h3>{{ servicio.nombre }}</h3>
                        <p class="resumen-emprendimiento">📍 {{ servicio.nombre_emprendimiento }}</p>
                        <div class="resumen-detalles">
                            <span>💰 ${{ servicio.precio }}</span>
                            <span>⏱️ {{ servicio.duracion }} min</span>
                        </div>
                    </div>

                    <!-- Formulario de reserva -->
                    <form @submit.prevent="reservarCita" class="form-reserva">
                        <div class="form-group">
                            <label for="fecha">📅 Fecha de la cita *</label>
                            <input 
                                type="date" 
                                id="fecha"
                                v-model="formulario.fecha"
                                :min="fechaMinima"
                                required
                            />
                        </div>

                        <div class="form-group">
                            <label for="hora">🕒 Hora de la cita *</label>
                            <select 
                                id="hora"
                                v-model="formulario.hora"
                                required
                            >
                                <option value="">Selecciona una hora</option>
                                <option v-for="hora in horasDisponibles" :key="hora" :value="hora">
                                    {{ hora }}
                                </option>
                            </select>
                        </div>

                        <div class="form-group">
                            <label for="notas">📝 Notas adicionales (opcional)</label>
                            <textarea 
                                id="notas"
                                v-model="formulario.notas"
                                placeholder="Ej: Preferencias, alergias, solicitudes especiales..."
                                rows="4"
                            ></textarea>
                        </div>

                        <!-- Mensaje de error -->
                        <div v-if="errorReserva" class="mensaje-error">
                            {{ errorReserva }}
                        </div>

                        <!-- Botones -->
                        <div class="modal-acciones">
                            <button type="button" @click="cerrarModal" class="btn-cancelar">
                                Cancelar
                            </button>
                            <button type="submit" class="btn-confirmar" :disabled="reservando">
                                {{ reservando ? 'Reservando...' : 'Confirmar reserva' }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import HeaderServicios from '../components/HeaderServicios.vue';

export default {
    name: "DetalleServicio",
    components: {
        HeaderServicios
    },
    data() {
        return {
            servicio: null,
            cargando: true,
            mostrarModal: false,
            reservando: false,
            errorReserva: '',
            formulario: {
                fecha: '',
                hora: '',
                notas: ''
            },
            horasDisponibles: [
                '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
                '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
                '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
                '17:00', '17:30', '18:00', '18:30', '19:00', '19:30', '20:00'
            ]
        }
    },
    computed: {
        fechaMinima() {
            const hoy = new Date();
            const year = hoy.getFullYear();
            const mes = String(hoy.getMonth() + 1).padStart(2, '0');
            const dia = String(hoy.getDate()).padStart(2, '0');
            return `${year}-${mes}-${dia}`;
        }
    },
    mounted() {
        this.cargarServicio();
    },
    methods: {
        async cargarServicio() {
            try {
                const id = this.$route.params.id;
                const respuesta = await fetch(`http://localhost:4000/api/servicios/publicos`);
                
                if (!respuesta.ok) throw new Error("Error al cargar servicio");

                const servicios = await respuesta.json();
                this.servicio = servicios.find(s => s.id_servicio === parseInt(id));

                console.log("Servicio cargado:", this.servicio);
            } catch (error) {
                console.error("Error:", error);
            } finally {
                this.cargando = false;
            }
        },

        cerrarModal() {
            this.mostrarModal = false;
            this.errorReserva = '';
            this.formulario = {
                fecha: '',
                hora: '',
                notas: ''
            };
        },

        async reservarCita() {
            try {
                this.reservando = true;
                this.errorReserva = '';

                const token = localStorage.getItem('token');
                if (!token) {
                    this.$router.push('/login');
                    return;
                }

                const respuesta = await fetch('http://localhost:4000/api/citas', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        id_servicio: this.servicio.id_servicio,
                        fecha: this.formulario.fecha,
                        hora: this.formulario.hora,
                        notas: this.formulario.notas || null
                    })
                });

                if (!respuesta.ok) {
                    const error = await respuesta.text();
                    throw new Error(error);
                }

                const cita = await respuesta.json();
                console.log('✅ Cita creada:', cita);

                // Mostrar mensaje de éxito
                alert(`¡Cita reservada con éxito!\n\nServicio: ${this.servicio.nombre}\nFecha: ${this.formulario.fecha}\nHora: ${this.formulario.hora}`);

                // Cerrar modal y redirigir
                this.cerrarModal();
                this.$router.push('/cliente/mis-citas');

            } catch (error) {
                console.error('❌ Error al reservar:', error);
                this.errorReserva = error.message || 'Error al reservar la cita';
            } finally {
                this.reservando = false;
            }
        },

        volver() {
            this.$router.push('/servicios');
        }
    }
}
</script>

<style scoped>
.detalle-page {
    min-height: 100vh;
    background: #F3EDFF;
}

.detalle-container {
    max-width: 1000px;
    margin: 40px auto;
    padding: 0 20px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
}

.detalle-imagen {
    position: sticky;
    top: 100px;
    height: fit-content;
}

.detalle-imagen img {
    width: 100%;
    height: 500px;
    object-fit: cover;
    border-radius: 20px;
    box-shadow: 0 8px 25px rgba(139, 95, 191, 0.2);
}

.detalle-info {
    padding: 20px;
}

.servicio-titulo {
    font-size: 2.5rem;
    color: #8B5FBF;
    margin-bottom: 20px;
}

.servicio-emprendimiento {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 30px;
    padding: 15px;
    background: white;
    border-radius: 10px;
}

.icono {
    font-size: 1.5rem;
}

.nombre-negocio {
    font-size: 1.2rem;
    font-weight: 600;
    color: #4E4E4E;
}

.servicio-precio-duracion {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
    margin-bottom: 30px;
}

.precio-box, .duracion-box {
    background: white;
    padding: 20px;
    border-radius: 10px;
    text-align: center;
}

.label {
    display: block;
    font-size: 0.9rem;
    color: #666;
    margin-bottom: 8px;
}

.valor {
    display: block;
    font-size: 1.8rem;
    font-weight: 700;
    color: #8B5FBF;
}

.servicio-descripcion, .servicio-ubicacion {
    background: white;
    padding: 25px;
    border-radius: 10px;
    margin-bottom: 20px;
}

.servicio-descripcion h3, .servicio-ubicacion h3 {
    color: #8B5FBF;
    margin-bottom: 15px;
    font-size: 1.3rem;
}

.servicio-descripcion p, .servicio-ubicacion p {
    color: #4E4E4E;
    line-height: 1.6;
    font-size: 1.05rem;
}

.btn-agendar {
    width: 100%;
    padding: 18px;
    background: #CAA6F7;
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 1.2rem;
    font-weight: 700;
    cursor: pointer;
    margin-bottom: 15px;
    transition: all 0.3s ease;
}

.btn-agendar:hover {
    background: #8B5FBF;
    transform: scale(1.02);
}

.btn-volver {
    width: 100%;
    padding: 15px;
    background: transparent;
    color: #8B5FBF;
    border: 2px solid #CAA6F7;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-volver:hover {
    background: #F3EDFF;
}

/* ✅ MODAL DE RESERVA */
.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 9999;
    animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
}

.modal-content {
    background: white;
    border-radius: 20px;
    width: 90%;
    max-width: 600px;
    max-height: 90vh;
    overflow-y: auto;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
    animation: slideUp 0.3s ease;
}

@keyframes slideUp {
    from {
        opacity: 0;
        transform: translateY(50px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.modal-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 30px;
    border-bottom: 2px solid #F3EDFF;
}

.modal-header h2 {
    color: #8B5FBF;
    margin: 0;
    font-size: 1.8rem;
}

.btn-cerrar-modal {
    background: transparent;
    border: none;
    font-size: 2rem;
    color: #666;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-cerrar-modal:hover {
    color: #f44336;
    transform: rotate(90deg);
}

.modal-body {
    padding: 30px;
}

/* Resumen del servicio */
.resumen-servicio {
    background: #F3EDFF;
    padding: 20px;
    border-radius: 15px;
    margin-bottom: 30px;
}

.resumen-servicio h3 {
    color: #8B5FBF;
    margin: 0 0 10px 0;
    font-size: 1.4rem;
}

.resumen-emprendimiento {
    color: #4E4E4E;
    margin: 0 0 15px 0;
}

.resumen-detalles {
    display: flex;
    gap: 20px;
    font-weight: 600;
    color: #8B5FBF;
}

/* Formulario */
.form-reserva {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-group {
    display: flex;
    flex-direction: column;
}

.form-group label {
    font-weight: 600;
    color: #4E4E4E;
    margin-bottom: 8px;
    font-size: 1rem;
}

.form-group input,
.form-group select,
.form-group textarea {
    padding: 12px 15px;
    border: 2px solid #E0E0E0;
    border-radius: 10px;
    font-size: 1rem;
    font-family: inherit;
    transition: all 0.3s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #8B5FBF;
    box-shadow: 0 0 0 3px rgba(139, 95, 191, 0.1);
}

.form-group textarea {
    resize: vertical;
}

/* Mensaje de error */
.mensaje-error {
    background: #ffe5e5;
    color: #d32f2f;
    padding: 12px 15px;
    border-radius: 8px;
    border-left: 4px solid #f44336;
    font-size: 0.95rem;
}

/* Acciones del modal */
.modal-acciones {
    display: flex;
    gap: 15px;
    margin-top: 30px;
}

.btn-cancelar,
.btn-confirmar {
    flex: 1;
    padding: 15px;
    border: none;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-cancelar {
    background: transparent;
    color: #666;
    border: 2px solid #E0E0E0;
}

.btn-cancelar:hover {
    background: #F5F5F5;
    border-color: #CCC;
}

.btn-confirmar {
    background: #8B5FBF;
    color: white;
}

.btn-confirmar:hover:not(:disabled) {
    background: #CAA6F7;
    transform: scale(1.02);
}

.btn-confirmar:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

/* Estados */
.cargando, .error {
    text-align: center;
    padding: 100px 20px;
}

.cargando p, .error p {
    font-size: 1.5rem;
    color: #666;
    margin-bottom: 20px;
}

/* Responsive */
@media (max-width: 768px) {
    .detalle-container {
        grid-template-columns: 1fr;
        gap: 20px;
    }

    .detalle-imagen {
        position: static;
    }

    .detalle-imagen img {
        height: 300px;
    }

    .servicio-titulo {
        font-size: 2rem;
    }

    .modal-content {
        width: 95%;
        max-height: 95vh;
    }

    .modal-header,
    .modal-body {
        padding: 20px;
    }

    .modal-acciones {
        flex-direction: column;
    }
}
</style>