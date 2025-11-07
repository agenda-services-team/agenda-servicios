<template> 
    <div class="perfil-page">
        <HeaderServicios />
        
        <div class="perfil-container">
            <!-- Header del perfil -->
            <div class="perfil-header">
                <div class="avatar-circle">
                    <span class="avatar-letra">{{ primeraLetra }}</span>
                </div>
                <h1 class="perfil-nombre">{{ usuario.nombre }}</h1>
                <p class="perfil-tipo">Cliente</p>
            </div>

            <!-- Información del usuario -->
            <div class="perfil-info">
                <h2 class="seccion-titulo">Información personal</h2>
                
                <div class="info-card">
                    <div class="info-item">
                        <span class="info-icono">📧</span>
                        <div class="info-contenido">
                            <p class="info-label">Correo electrónico</p>
                            <p class="info-valor">{{ usuario.correo }}</p>
                        </div>
                    </div>

                    <div class="info-item">
                        <span class="info-icono">📱</span>
                        <div class="info-contenido">
                            <p class="info-label">Teléfono</p>
                            <p class="info-valor">{{ usuario.telefono || 'No registrado' }}</p>
                        </div>
                    </div>

                    <div class="info-item">
                        <span class="info-icono">📅</span>
                        <div class="info-contenido">
                            <p class="info-label">Miembro desde</p>
                            <p class="info-valor">{{ fechaRegistro }}</p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Botones de acción -->
            <div class="perfil-acciones">
                <router-link to="/cliente/mis-citas" class="btn-accion btn-citas">
                    <span class="btn-icono">📋</span>
                    Ver mis citas
                </router-link>
                
                <button @click="cerrarSesion" class="btn-accion btn-cerrar-sesion">
                    <span class="btn-icono">🚪</span>
                    Cerrar sesión
                </button>
            </div>
        </div>
    </div>
</template>

<script>
import HeaderServicios from '../components/HeaderServicios.vue';

export default {
    name: "PerfilCliente",
    components: {
        HeaderServicios
    },
    data() {
        return {
            usuario: {
                nombre: '',
                correo: '',
                telefono: '',
                fecha_registro: ''
            }
        }
    },
    computed: {
        primeraLetra() {
            return this.usuario.nombre ? this.usuario.nombre.charAt(0).toUpperCase() : 'U';
        },
        fechaRegistro() {
            if (!this.usuario.fecha_registro) return 'No disponible';
            
            const fecha = new Date(this.usuario.fecha_registro);
            const opciones = { year: 'numeric', month: 'long', day: 'numeric' };
            return fecha.toLocaleDateString('es-MX', opciones);
        }
    },
    mounted() {
        this.cargarDatosUsuario();
    },
    methods: {
        async cargarDatosUsuario() {
            try {
                const token = localStorage.getItem('token');
                const id_usuario = localStorage.getItem('id_usuario');

                if (!token || !id_usuario) {
                    this.$router.push('/login');
                    return;
                }

                // Llamar al endpoint para obtener datos del usuario
                const response = await fetch(`http://localhost:4000/api/usuarios/perfil/${id_usuario}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) throw new Error('Error al obtener datos');

                const data = await response.json();
                this.usuario = data;

            } catch (error) {
                console.error('Error al cargar perfil:', error);
                alert('Error al cargar tu perfil. Intenta iniciar sesión nuevamente.');
            }
        },

        cerrarSesion() {
            // Confirmar antes de cerrar sesión
            if (confirm('¿Estás seguro de que deseas cerrar sesión?')) {
                // Limpiar localStorage
                localStorage.removeItem('token');
                localStorage.removeItem('id_usuario');
                localStorage.removeItem('nombre');
                localStorage.removeItem('id_proveedor');

                // Redirigir al login
                this.$router.push('/login');
            }
        }
    }
}
</script>

<style scoped>
:root {
    --lavanda-clara: #F3EDFF;
    --lila-pastel: #CAA6F7;
    --morado-suave: #8B5FBF;
    --gris-humo: #4E4E4E;
    --blanco: #FFFFFF;
}

.perfil-page {
    min-height: 100vh;
    background: var(--lavanda-clara);
}

.perfil-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 40px 20px;
}

/* Header del perfil */
.perfil-header {
    text-align: center;
    margin-bottom: 40px;
}

.avatar-circle {
    width: 120px;
    height: 120px;
    border-radius: 50%;
    background: linear-gradient(135deg, var(--morado-suave), var(--lila-pastel));
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 20px auto;
    box-shadow: 0 4px 15px rgba(139, 95, 191, 0.3);
}

.avatar-letra {
    font-size: 3rem;
    font-weight: 700;
    color: white;
}

.perfil-nombre {
    font-size: 2rem;
    color: var(--morado-suave);
    margin-bottom: 5px;
}

.perfil-tipo {
    color: var(--gris-humo);
    font-size: 1.1rem;
}

/* Información del usuario */
.perfil-info {
    margin-bottom: 40px;
}

.seccion-titulo {
    font-size: 1.5rem;
    color: var(--morado-suave);
    margin-bottom: 20px;
}

.info-card {
    background: white;
    border-radius: 15px;
    padding: 25px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.info-item {
    display: flex;
    align-items: flex-start;
    gap: 15px;
    padding: 20px 0;
    border-bottom: 1px solid var(--lavanda-clara);
}

.info-item:last-child {
    border-bottom: none;
}

.info-icono {
    font-size: 1.8rem;
    min-width: 40px;
    text-align: center;
}

.info-contenido {
    flex: 1;
}

.info-label {
    font-size: 0.9rem;
    color: var(--gris-humo);
    margin-bottom: 5px;
}

.info-valor {
    font-size: 1.1rem;
    color: var(--morado-suave);
    font-weight: 600;
}

/* Botones de acción */
.perfil-acciones {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.btn-accion {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    padding: 15px 30px;
    border-radius: 50px;
    font-size: 1.1rem;
    font-weight: 600;
    text-decoration: none;
    border: none;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-icono {
    font-size: 1.3rem;
}

.btn-citas {
    background: rgb(105, 104, 107);
    color: rgb(54, 49, 49);
}

.btn-citas:hover {
    background: var(--morado-suave);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 95, 191, 0.3);
}

.btn-cerrar-sesion {
    background: rgb(231, 132, 132);
    color: var(--morado-suave);
    border: 2px solid var(--lila-pastel);
}

.btn-cerrar-sesion:hover {
    background: #ffe5e5;
    border-color: #ff6b6b;
    color: #ff6b6b;
    transform: translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
    .perfil-container {
        padding: 20px 15px;
    }

    .avatar-circle {
        width: 100px;
        height: 100px;
    }

    .avatar-letra {
        font-size: 2.5rem;
    }

    .perfil-nombre {
        font-size: 1.5rem;
    }

    .info-card {
        padding: 15px;
    }

    .btn-accion {
        padding: 12px 25px;
        font-size: 1rem;
    }
}
</style>