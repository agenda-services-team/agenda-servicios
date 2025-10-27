<template>
    <div class="perfil-page">
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
                <h1>Mi Perfil</h1>
                <div class="header-actions">
                    <button class="btn-secondary" @click="cerrarSesion">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                            <polyline points="16 17 21 12 16 7"></polyline>
                            <line x1="21" y1="12" x2="9" y2="12"></line>
                        </svg>
                        Cerrar Sesión
                    </button>
                </div>
            </div>
        </header>

        <!-- Contenido Principal -->
        <div class="perfil-content">
            <!-- Información del Usuario -->
            <div class="profile-section">
                <div class="section-header">
                    <h2>Información Personal</h2>
                    <button class="edit-btn" @click="editarPerfil">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Editar
                    </button>
                </div>

                <div class="user-info-card">
                    <div class="avatar-section">
                        <div class="avatar">
                            {{ getUserInitials }}
                        </div>
                        <div class="avatar-actions">
                            <button class="btn-change-photo" @click="cambiarFoto">
                                Cambiar Foto
                            </button>
                        </div>
                    </div>

                    <div class="info-grid">
                        <div class="info-item">
                            <label>Nombre Completo</label>
                            <p>{{ usuario.nombre || 'No especificado' }}</p>
                        </div>
                        <div class="info-item">
                            <label>Correo Electrónico</label>
                            <p>{{ usuario.correo || 'No especificado' }}</p>
                        </div>
                        <div class="info-item">
                            <label>Teléfono</label>
                            <p>{{ usuario.telefono || 'No especificado' }}</p>
                        </div>
                        <div class="info-item">
                            <label>Tipo de Usuario</label>
                            <p class="user-type">{{ tipoUsuarioTexto }}</p>
                        </div>
                        <div class="info-item">
                            <label>Fecha de Registro</label>
                            <p>{{ fechaRegistro }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Estadísticas -->
            <div class="stats-section" v-if="usuario.tipo_usuario === 'cliente'">
                <h2>Mis Estadísticas</h2>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-icon">📅</div>
                        <div class="stat-info">
                            <h3>{{ estadisticas.citasTotales || 0 }}</h3>
                            <p>Citas Totales</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">✅</div>
                        <div class="stat-info">
                            <h3>{{ estadisticas.citasCompletadas || 0 }}</h3>
                            <p>Completadas</p>
                        </div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-icon">⭐</div>
                        <div class="stat-info">
                            <h3>{{ estadisticas.calificacionPromedio || 'N/A' }}</h3>
                            <p>Calificación</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Emprendimiento (solo para proveedores) -->
            <div class="emprendimiento-section" v-if="usuario.tipo_usuario === 'proveedor' && emprendimiento">
                <div class="section-header">
                    <h2>Mi Emprendimiento</h2>
                    <button class="edit-btn" @click="editarEmprendimiento">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                        </svg>
                        Gestionar
                    </button>
                </div>

                <div class="emprendimiento-card">
                    <div class="emprendimiento-info">
                        <h3>{{ emprendimiento.nombre_negocio || 'Sin nombre' }}</h3>
                        <p class="emprendimiento-desc">{{ emprendimiento.descripcion || 'Sin descripción' }}</p>
                        <div class="emprendimiento-details">
                            <div class="detail-item">
                                <strong>Teléfono:</strong> {{ emprendimiento.telefono || 'No especificado' }}
                            </div>
                            <div class="detail-item">
                                <strong>Dirección:</strong> {{ emprendimiento.direccion || 'No especificada' }}
                            </div>
                            <div class="detail-item">
                                <strong>Horario:</strong> {{ emprendimiento.horario_atencion || 'No especificado' }}
                            </div>
                        </div>
                    </div>
                    <div class="emprendimiento-stats">
                        <div class="emp-stat">
                            <span class="stat-number">{{ emprendimiento.total_servicios || 0 }}</span>
                            <span class="stat-label">Servicios</span>
                        </div>
                        <div class="emp-stat">
                            <span class="stat-number">{{ emprendimiento.citas_pendientes || 0 }}</span>
                            <span class="stat-label">Citas Pendientes</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Configuración -->
            <div class="settings-section">
                <h2>Configuración</h2>
                <div class="settings-list">
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>Notificaciones</h4>
                            <p>Recibir recordatorios de citas y promociones</p>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" v-model="configuraciones.notificaciones">
                            <span class="slider"></span>
                        </label>
                    </div>
                    <div class="setting-item">
                        <div class="setting-info">
                            <h4>Correos Promocionales</h4>
                            <p>Recibir ofertas y novedades por correo</p>
                        </div>
                        <label class="toggle-switch">
                            <input type="checkbox" v-model="configuraciones.correosPromocionales">
                            <span class="slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal de Edición -->
        <div class="modal" v-if="mostrarModalEdicion" @click="cerrarModal">
            <div class="modal-content" @click.stop>
                <h2>Editar Perfil</h2>
                <form @submit.prevent="guardarCambios" class="edit-form">
                    <div class="form-group">
                        <label>Nombre Completo</label>
                        <input type="text" v-model="edicionForm.nombre" required>
                    </div>
                    <div class="form-group">
                        <label>Teléfono</label>
                        <input type="tel" v-model="edicionForm.telefono">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn-cancelar" @click="cerrarModal">Cancelar</button>
                        <button type="submit" class="btn-guardar">Guardar Cambios</button>
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
    name: 'PerfilUsuario',
    data() {
        return {
            usuario: {},
            emprendimiento: null,
            estadisticas: {},
            configuraciones: {
                notificaciones: true,
                correosPromocionales: false
            },
            mostrarModalEdicion: false,
            edicionForm: {
                nombre: '',
                telefono: ''
            },
            loading: true
        }
    },
    computed: {
        ...mapState(useAuthStore, ['userName', 'userId', 'userType']),
        
        getUserInitials() {
            return this.usuario.nombre
                ?.split(' ')
                .map(word => word[0])
                .join('')
                .toUpperCase()
                .substring(0, 2) || 'US';
        },
        
        tipoUsuarioTexto() {
            const tipos = {
                'cliente': 'Cliente',
                'proveedor': 'Proveedor de Servicios',
                'admin': 'Administrador'
            };
            return tipos[this.usuario.tipo_usuario] || 'Usuario';
        },
        
        fechaRegistro() {
            if (!this.usuario.fecha_registro) return 'No disponible';
            return new Date(this.usuario.fecha_registro).toLocaleDateString('es-MX');
        }
    },
    async mounted() {
        await this.cargarPerfil();
        await this.cargarEstadisticas();
        if (this.usuario.tipo_usuario === 'proveedor') {
            await this.cargarEmprendimiento();
        }
    },
    methods: {
        async cargarPerfil() {
            try {
                this.loading = true;
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('id_usuario');
                
                const response = await fetch(`http://localhost:4000/api/usuarios/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (!response.ok) throw new Error('Error al cargar perfil');
                
                this.usuario = await response.json();
                this.edicionForm = {
                    nombre: this.usuario.nombre || '',
                    telefono: this.usuario.telefono || ''
                };
                
            } catch (error) {
                console.error('Error cargando perfil:', error);
                // Datos de ejemplo si falla
                this.usuario = {
                    nombre: this.userName || 'Usuario Demo',
                    correo: 'usuario@ejemplo.com',
                    telefono: '+52 123 456 7890',
                    tipo_usuario: this.userType || 'cliente',
                    fecha_registro: new Date().toISOString()
                };
            } finally {
                this.loading = false;
            }
        },

        async cargarEmprendimiento() {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('id_usuario');
                
                const response = await fetch(`http://localhost:4000/api/emprendimientos/usuario/${userId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    if (data.tieneEmprendimiento) {
                        this.emprendimiento = data.emprendimiento;
                    }
                }
            } catch (error) {
                console.error('Error cargando emprendimiento:', error);
            }
        },

        async cargarEstadisticas() {
            try {
                const token = localStorage.getItem('token');
                const response = await fetch('http://localhost:4000/api/usuarios/estadisticas', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    this.estadisticas = await response.json();
                }
            } catch (error) {
                console.error('Error cargando estadísticas:', error);
            }
        },

        editarPerfil() {
            this.mostrarModalEdicion = true;
        },

        cerrarModal() {
            this.mostrarModalEdicion = false;
        },

        async guardarCambios() {
            try {
                const token = localStorage.getItem('token');
                const userId = localStorage.getItem('id_usuario');
                
                const response = await fetch(`http://localhost:4000/api/usuarios/${userId}`, {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`
                    },
                    body: JSON.stringify(this.edicionForm)
                });
                
                if (!response.ok) throw new Error('Error al guardar cambios');
                
                await this.cargarPerfil();
                this.mostrarModalEdicion = false;
                alert('Perfil actualizado correctamente');
                
            } catch (error) {
                console.error('Error guardando cambios:', error);
                alert('Error al actualizar el perfil');
            }
        },

        cambiarFoto() {
            alert('Funcionalidad de cambio de foto en desarrollo');
        },

        editarEmprendimiento() {
            this.$router.push('/dashboard/emprendimiento');
        },

        async cerrarSesion() {
            const authStore = useAuthStore();
            authStore.logout();
            this.$router.push('/login');
        }
    }
}
</script>

<style scoped>
/* Variables de colores */
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

.perfil-page {
    min-height: 100vh;
    background: var(--background);
    padding-bottom: 2rem;
}

/* Header */
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

.header-content h1 {
    font-size: 1.8rem;
    font-weight: 700;
    color: var(--text);
    margin: 0;
}

.btn-secondary {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    background: none;
    border: 2px solid #e53e3e;
    color: #e53e3e;
    padding: 0.5rem 1rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-secondary:hover {
    background: #e53e3e;
    color: white;
}

/* Contenido Principal */
.perfil-content {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    flex-direction: column;
    gap: 2rem;
}

/* Secciones */
.profile-section,
.stats-section,
.emprendimiento-section,
.settings-section {
    background: var(--surface);
    border-radius: 16px;
    padding: 2rem;
    box-shadow: 0 4px 15px var(--shadow);
}

.section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
}

.section-header h2 {
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--text);
    margin: 0;
}

.edit-btn {
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

.edit-btn:hover {
    background: var(--primary-light);
}

/* Información del Usuario */
.user-info-card {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 2rem;
    align-items: start;
}

.avatar-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;
}

.avatar {
    width: 100px;
    height: 100px;
    background: linear-gradient(135deg, var(--primary), #553a6a);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-weight: 700;
    font-size: 1.5rem;
}

.btn-change-photo {
    background: none;
    border: 1px solid var(--border);
    color: var(--text);
    padding: 0.5rem 1rem;
    border-radius: 6px;
    cursor: pointer;
    font-size: 0.9rem;
    transition: all 0.3s ease;
}

.btn-change-photo:hover {
    background: var(--border);
}

.info-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 1.5rem;
}

.info-item label {
    display: block;
    font-weight: 600;
    color: var(--text-light);
    font-size: 0.9rem;
    margin-bottom: 0.25rem;
}

.info-item p {
    margin: 0;
    color: var(--text);
    font-size: 1.1rem;
}

.user-type {
    background: var(--primary);
    color: white;
    padding: 0.25rem 0.75rem;
    border-radius: 15px;
    font-size: 0.8rem;
    font-weight: 600;
    display: inline-block;
}

/* Estadísticas */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 1rem;
}

.stat-card {
    background: var(--background);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 1.5rem;
    display: flex;
    align-items: center;
    gap: 1rem;
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px var(--shadow);
}

.stat-icon {
    font-size: 2rem;
}

.stat-info h3 {
    margin: 0;
    font-size: 2rem;
    font-weight: 800;
    color: var(--primary);
}

.stat-info p {
    margin: 0;
    color: var(--text-light);
    font-size: 0.9rem;
}

/* Emprendimiento */
.emprendimiento-card {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2rem;
    align-items: start;
}

.emprendimiento-info h3 {
    margin: 0 0 0.5rem 0;
    font-size: 1.3rem;
    color: var(--text);
}

.emprendimiento-desc {
    color: var(--text-light);
    margin: 0 0 1rem 0;
    line-height: 1.5;
}

.emprendimiento-details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.detail-item {
    font-size: 0.95rem;
    color: var(--text);
}

.emprendimiento-stats {
    display: flex;
    gap: 1.5rem;
}

.emp-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.stat-number {
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--primary);
}

.stat-label {
    font-size: 0.8rem;
    color: var(--text-light);
    margin-top: 0.25rem;
}

/* Configuración */
.settings-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.setting-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    background: var(--background);
    border-radius: 12px;
    border: 1px solid var(--border);
}

.setting-info h4 {
    margin: 0 0 0.25rem 0;
    color: var(--text);
}

.setting-info p {
    margin: 0;
    color: var(--text-light);
    font-size: 0.9rem;
}

/* Toggle Switch */
.toggle-switch {
    position: relative;
    display: inline-block;
    width: 50px;
    height: 24px;
}

.toggle-switch input {
    opacity: 0;
    width: 0;
    height: 0;
}

.slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: .4s;
    border-radius: 24px;
}

.slider:before {
    position: absolute;
    content: "";
    height: 16px;
    width: 16px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: .4s;
    border-radius: 50%;
}

input:checked + .slider {
    background-color: var(--primary);
}

input:checked + .slider:before {
    transform: translateX(26px);
}

/* Modal */
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
    border-radius: 16px;
    padding: 2rem;
    width: 100%;
    max-width: 500px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.modal-content h2 {
    margin: 0 0 1.5rem 0;
    color: var(--text);
}

.edit-form {
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

.form-group input {
    padding: 0.75rem;
    border: 2px solid var(--border);
    border-radius: 8px;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.form-group input:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--shadow);
}

.form-actions {
    display: flex;
    gap: 1rem;
    margin-top: 1rem;
}

.btn-cancelar,
.btn-guardar {
    flex: 1;
    padding: 0.75rem;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-cancelar {
    background: none;
    border: 2px solid var(--border);
    color: var(--text);
}

.btn-guardar {
    background: var(--primary);
    border: none;
    color: white;
}

.btn-cancelar:hover {
    background: var(--border);
}

.btn-guardar:hover {
    background: var(--primary-light);
}

/* Responsive */
@media (max-width: 768px) {
    .perfil-content {
        padding: 0 1rem;
    }
    
    .header-content {
        padding: 1rem;
        flex-direction: column;
        gap: 1rem;
        text-align: center;
    }
    
    .user-info-card {
        grid-template-columns: 1fr;
        text-align: center;
    }
    
    .emprendimiento-card {
        grid-template-columns: 1fr;
    }
    
    .stats-grid {
        grid-template-columns: 1fr;
    }
    
    .info-grid {
        grid-template-columns: 1fr;
    }
}
</style>