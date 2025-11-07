<template>
    <div class="catalogo-page">
        <Navbar />
        
        <!-- Hero pequeño -->
        <section class="catalogo-hero">
            <h1 class="hero-titulo">Servicios de Belleza</h1>
            <p class="hero-subtitulo">Encuentra el servicio perfecto para ti</p>
        </section>

        <!-- Filtros y buscador -->
        <section class="filtros-section">
            <div class="filtros-container">
                <input 
                    type="text" 
                    v-model="busqueda" 
                    placeholder="Buscar servicios..." 
                    class="buscador"
                />
                
                <div class="categorias-filtro">
                    <button 
                        v-for="cat in categorias" 
                        :key="cat"
                        @click="categoriaSeleccionada = cat"
                        :class="['btn-categoria-filtro', { active: categoriaSeleccionada === cat }]"
                    >
                        {{ cat }}
                    </button>
                </div>
            </div>
        </section>

        <!-- Grid de servicios -->
        <section class="servicios-grid">
            <div class="servicios-container">
                <div 
                    v-for="servicio in serviciosFiltrados" 
                    :key="servicio.id_servicio"
                    class="servicio-card"
                >
                    <img 
                        :src="servicio.imagen || '/src/images/default-service.jpg'" 
                        :alt="servicio.nombre"
                        class="servicio-imagen"
                    />
                    <div class="servicio-info">
                        <h3 class="servicio-nombre">{{ servicio.nombre }}</h3>
                        <p class="servicio-descripcion">{{ servicio.descripcion }}</p>
                        <p class="servicio-precio">${{ servicio.precio }}</p>
                        <p class="servicio-duracion">⏱️ {{ servicio.duracion }} min</p>
                        
                        <router-link to="/login" class="btn-agendar">
                            Agendar cita
                        </router-link>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA para registro -->
        <section class="cta-section">
            <h2 class="cta-titulo">¿Listo para reservar?</h2>
            <p class="cta-texto">Crea tu cuenta y empieza a agendar tus citas</p>
            <router-link to="/registro" class="btn-cta">
                Crear cuenta gratis
            </router-link>
        </section>
    </div>
</template>

<script>
import Navbar from '../components/Navbar.vue';

export default {
    name: "ServiciosCatalogo",
    components: {
        Navbar
    },
    data() {
        return {
            servicios: [],
            busqueda: '',
            categoriaSeleccionada: 'Todos',
            categorias: ['Todos', 'Spa', 'Cabello', 'Masaje', 'Facial', 'Uñas', 'Maquillaje']
        }
    },
    computed: {
        serviciosFiltrados() {
            let resultado = this.servicios;
            
            // Filtrar por categoría
            if (this.categoriaSeleccionada !== 'Todos') {
                resultado = resultado.filter(s => 
                    s.categoria === this.categoriaSeleccionada
                );
            }
            
            // Filtrar por búsqueda
            if (this.busqueda) {
                resultado = resultado.filter(s => 
                    s.nombre.toLowerCase().includes(this.busqueda.toLowerCase()) ||
                    s.descripcion.toLowerCase().includes(this.busqueda.toLowerCase())
                );
            }
            
            return resultado;
        }
    },
    mounted() {
        this.cargarServicios();
    },
    methods: {
        async cargarServicios() {
            try {
                // SIN autenticación - endpoint público
                const respuesta = await fetch("http://localhost:4000/api/servicios/publicos");
                
                if (!respuesta.ok) throw new Error("Error al obtener servicios");
                
                const data = await respuesta.json();
                this.servicios = data;
            } catch (error) {
                console.error("Error:", error);
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

.catalogo-page {
    min-height: 100vh;
    background: #F3EDFF; /* ✅ Directo en lugar de var() */
}

/* Hero pequeño */
.catalogo-hero {
    background: linear-gradient(135deg, #8B5FBF, #CAA6F7); /* ✅ Directo */
    padding: 80px 20px;
    text-align: center;
    color: #FFFFFF; /* ✅ Blanco directo */
}

.hero-titulo {
    font-size: 3rem;
    font-weight: 700;
    margin-bottom: 10px;
    color: #FFFFFF; /* ✅ Agregado */
}

.hero-subtitulo {
    font-size: 1.3rem;
    opacity: 0.95;
    color: #FFFFFF; /* ✅ Agregado */
}

/* Filtros */
.filtros-section {
    padding: 40px 20px;
    background: #FFFFFF; /* ✅ Blanco */
}

.filtros-container {
    max-width: 1200px;
    margin: 0 auto;
}

.buscador {
    width: 100%;
    max-width: 500px;
    padding: 15px 20px;
    border: 2px solid #CAA6F7; /* ✅ Directo */
    border-radius: 50px;
    font-size: 1rem;
    margin-bottom: 30px;
    background: #FFFFFF; /* ✅ Agregado */
    color: #4E4E4E; /* ✅ Agregado */
}

.categorias-filtro {
    display: flex;
    gap: 15px;
    flex-wrap: wrap;
    justify-content: center;
}

.btn-categoria-filtro {
    padding: 10px 25px;
    border: 2px solid #CAA6F7; /* ✅ Directo */
    background: transparent;
    color: #8B5FBF; /* ✅ Directo */
    border-radius: 50px;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
}

.btn-categoria-filtro.active,
.btn-categoria-filtro:hover {
    background: #CAA6F7; /* ✅ Directo */
    color: white;
}

/* Grid de servicios */
.servicios-grid {
    padding: 60px 20px;
}

.servicios-container {
    max-width: 1200px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 30px;
}

.servicio-card {
    background: white;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 4px 15px rgba(139, 95, 191, 0.15);
    transition: transform 0.3s ease;
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
    font-size: 1.5rem;
    color: #8B5FBF; /* ✅ Directo */
    margin-bottom: 10px;
}

.servicio-descripcion {
    color: #4E4E4E; /* ✅ Directo */
    margin-bottom: 15px;
    line-height: 1.5;
}

.servicio-precio {
    font-size: 1.8rem;
    color: #8B5FBF; /* ✅ Directo */
    font-weight: 700;
    margin-bottom: 5px;
}

.servicio-duracion {
    color: #4E4E4E; /* ✅ Directo */
    margin-bottom: 15px;
}

.btn-agendar {
    display: block;
    width: 100%;
    padding: 12px;
    background: #CAA6F7; /* ✅ Directo */
    color: white;
    text-align: center;
    border-radius: 50px;
    text-decoration: none;
    font-weight: 600;
    transition: all 0.3s ease;
}

.btn-agendar:hover {
    background: #8B5FBF; /* ✅ Directo */
    transform: scale(1.05);
}

/* CTA final */
.cta-section {
    background: #8B5FBF; /* ✅ Directo */
    padding: 80px 20px;
    text-align: center;
    color: #FFFFFF; /* ✅ Blanco */
}

.cta-titulo {
    font-size: 2.5rem;
    margin-bottom: 15px;
    color: #FFFFFF; /* ✅ Agregado */
}

.cta-texto {
    font-size: 1.2rem;
    margin-bottom: 30px;
    color: #FFFFFF; /* ✅ Agregado */
}

.btn-cta {
    display: inline-block;
    padding: 15px 40px;
    background: white;
    color: #8B5FBF; /* ✅ Directo */
    border-radius: 50px;
    text-decoration: none;
    font-weight: 700;
    font-size: 1.1rem;
    transition: all 0.3s ease;
}

.btn-cta:hover {
    transform: scale(1.1);
    box-shadow: 0 6px 20px rgba(255, 255, 255, 0.3);
}

/* Responsive */
@media (max-width: 768px) {
    .hero-titulo {
        font-size: 2rem;
    }
    
    .servicios-container {
        grid-template-columns: 1fr;
    }
}
</style>