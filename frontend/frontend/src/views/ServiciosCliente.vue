<template>
    <div class="servicios-page">
        <header-servicios @search="buscarServicios" />
        
        <!-- Hero con imagen -->
        <section class="hero-fullscreen">
            <div class="hero-overlay">
                <h1 class="hero-title">Encuentra tu servicio ideal</h1>
                <p class="hero-subtitle">Los mejores profesionales de belleza en Oaxaca</p>
            </div>
        </section>

        <!-- Grid de servicios -->
        <section class="servicios-section">
            <div class="servicios-container">
                <h2 class="section-title">Todos los servicios disponibles</h2>
                
                <!-- ✅ AGREGAR: Mostrar término de búsqueda activo -->
                <div v-if="busqueda" class="busqueda-activa">
                    <p>Buscando: <strong>{{ busqueda }}</strong></p>
                    <button @click="limpiarBusqueda" class="btn-limpiar">
                        ✕ Limpiar búsqueda
                    </button>
                </div>
                
                <!-- Cargando -->
                <div v-if="cargando" class="cargando">
                    <p>Cargando servicios...</p>
                </div>

                <!-- Grid de servicios -->
                <div v-else-if="serviciosFiltrados.length > 0" class="servicios-grid">
                    <div 
                        v-for="servicio in serviciosFiltrados" 
                        :key="servicio.id_servicio"
                        class="servicio-card"
                        @click="verDetalle(servicio.id_servicio)"
                    >
                        <img 
                            :src="servicio.imagen || '/src/images/default-service.jpg'" 
                            :alt="servicio.nombre"
                            class="servicio-imagen"
                        />
                        <div class="servicio-info">
                            <h3 class="servicio-nombre">{{ servicio.nombre }}</h3>
                            <p class="servicio-emprendimiento">📍 {{ servicio.nombre_emprendimiento }}</p>
                            <p class="servicio-precio">${{ servicio.precio }}</p>
                            <p class="servicio-duracion">⏱️ {{ servicio.duracion }} min</p>
                            <button class="btn-ver-detalle">Ver detalles</button>
                        </div>
                    </div>
                </div>

                <!-- Sin resultados -->
                <div v-else class="sin-resultados">
                    <p>😔 No se encontraron servicios</p>
                    <button @click="limpiarBusqueda" class="btn-volver-todos">
                        Ver todos los servicios
                    </button>
                </div>
            </div>
        </section>
    </div>
</template>

<script>
import HeaderServicios from '../components/HeaderServicios.vue';

export default {
    components: {
        HeaderServicios
    },
    data() {
        return {
            servicios: [],
            cargando: true,
            busqueda: ''
        }
    },
    computed: {
        serviciosFiltrados() {
            console.log('🔍 Filtrando servicios...'); // ✅ Debug
            console.log('📝 Búsqueda actual:', this.busqueda);
            console.log('📦 Total servicios:', this.servicios.length);
            
            // ✅ Si NO hay búsqueda, devolver TODOS
            if (!this.busqueda || this.busqueda.trim() === '') {
                console.log('✅ Mostrando todos los servicios');
                return this.servicios;
            }
            
            // ✅ Si HAY búsqueda, filtrar
            const busquedaLower = this.busqueda.toLowerCase().trim();
            const filtrados = this.servicios.filter(s => {
                const nombre = s.nombre?.toLowerCase() || '';
                const descripcion = s.descripcion?.toLowerCase() || '';
                const emprendimiento = s.nombre_emprendimiento?.toLowerCase() || '';
                
                return nombre.includes(busquedaLower) ||
                       descripcion.includes(busquedaLower) ||
                       emprendimiento.includes(busquedaLower);
            });
            
            console.log('🎯 Servicios filtrados:', filtrados.length);
            return filtrados;
        }
    },
    mounted() {
        this.cargarServicios();
    },
    methods: {
        async cargarServicios() {
            try {
                this.cargando = true;
                const respuesta = await fetch("http://localhost:4000/api/servicios/publicos");
                
                if (!respuesta.ok) throw new Error("Error al obtener los servicios");

                const data = await respuesta.json();
                console.log("✅ Servicios obtenidos:", data.length);

                this.servicios = data;
            } catch (error) {
                console.error("❌ Error al cargar los servicios:", error);
                alert("Error al cargar servicios");
            } finally {
                this.cargando = false;
            }
        },
        
        buscarServicios(query) {
            console.log('🔎 Búsqueda recibida:', query);
            this.busqueda = query || ''; // ✅ Asegurar que sea string vacío si es null
        },
        
        // ✅ NUEVO: Método para limpiar búsqueda
        limpiarBusqueda() {
            console.log('🧹 Limpiando búsqueda');
            this.busqueda = '';
        },
        
        verDetalle(id) {
            this.$router.push(`/servicio/${id}`);
        }
    }
};
</script>

<style scoped>
.servicios-page {
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    background: #F3EDFF;
}

/* Hero */
.hero-fullscreen {
    position: relative;
    height: 400px;
    background-image: url('/src/images/img2.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
}

.hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: white;
}

.hero-title {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 10px;
}

.hero-subtitle {
    font-size: 1.3rem;
}

/* Sección de servicios */
.servicios-section {
    padding: 60px 20px;
}

.servicios-container {
    max-width: 1200px;
    margin: 0 auto;
}

.section-title {
    font-size: 2rem;
    color: #8B5FBF;
    margin-bottom: 40px;
    text-align: center;
}

/* ✅ NUEVO: Barra de búsqueda activa */
.busqueda-activa {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: white;
    padding: 15px 20px;
    border-radius: 10px;
    margin-bottom: 30px;
    box-shadow: 0 2px 8px rgba(139, 95, 191, 0.1);
}

.busqueda-activa p {
    margin: 0;
    color: #4E4E4E;
}

.busqueda-activa strong {
    color: #8B5FBF;
}

.btn-limpiar {
    padding: 8px 16px;
    background: #f44336;
    color: white;
    border: none;
    border-radius: 6px;
    cursor: pointer;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-limpiar:hover {
    background: #d32f2f;
    transform: scale(1.05);
}

/* Grid de servicios */
.servicios-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 30px;
}

.servicio-card {
    background: white;
    border-radius: 15px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(139, 95, 191, 0.15);
    transition: all 0.3s ease;
    cursor: pointer;
}

.servicio-card:hover {
    transform: translateY(-10px);
    box-shadow: 0 8px 25px rgba(139, 95, 191, 0.25);
}

.servicio-imagen {
    width: 100%;
    height: 200px;
    object-fit: cover;
}

.servicio-info {
    padding: 20px;
}

.servicio-nombre {
    font-size: 1.3rem;
    color: #8B5FBF;
    margin-bottom: 10px;
    font-weight: 600;
}

.servicio-emprendimiento {
    color: #4E4E4E;
    margin-bottom: 10px;
    font-size: 0.95rem;
}

.servicio-precio {
    font-size: 1.5rem;
    color: #8B5FBF;
    font-weight: 700;
    margin-bottom: 5px;
}

.servicio-duracion {
    color: #666;
    margin-bottom: 15px;
}

.btn-ver-detalle {
    width: 100%;
    padding: 12px;
    background: #CAA6F7;
    color: white;
    border: none;
    border-radius: 8px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-ver-detalle:hover {
    background: #8B5FBF;
}

/* Estados */
.cargando, .sin-resultados {
    text-align: center;
    padding: 60px 20px;
    font-size: 1.2rem;
    color: #666;
}

.sin-resultados p {
    margin-bottom: 20px;
    font-size: 1.5rem;
}

/* ✅ NUEVO: Botón volver a todos */
.btn-volver-todos {
    padding: 12px 30px;
    background: #8B5FBF;
    color: white;
    border: none;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s ease;
}

.btn-volver-todos:hover {
    background: #CAA6F7;
    transform: scale(1.05);
}

/* Responsive */
@media (max-width: 768px) {
    .hero-fullscreen {
        height: 250px;
    }
    
    .hero-title {
        font-size: 2rem;
    }
    
    .hero-subtitle {
        font-size: 1rem;
    }
    
    .servicios-grid {
        grid-template-columns: 1fr;
    }

    .busqueda-activa {
        flex-direction: column;
        gap: 10px;
        text-align: center;
    }
}
</style>
