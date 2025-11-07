<template>  
    <div class="home-page">
        <!-- Imagen fullscreen con botón -->
        <section class="hero-fullscreen">
            <div class="hero-overlay">
                <h1 class="hero-title">Descubre tu belleza</h1>
                <p class="hero-subtitle">Explora los mejores servicios estéticos de Oaxaca</p>
                <router-link to="/serviciosCatalogo" class="btn-hero">
                    Ver servicios
                </router-link>
            </div>
        </section>

        <!-- Contenido con scroll -->
        <section class="content-section">
            <div class="content-wrapper">
                <h2 class="titulo-bienvenida">Bienvenido a OaxacaGlow</h2>
                <p class="descripcion-home">
                    El sitio perfecto donde puedes explorar los diversos<br>
                    servicios estéticos que Oaxaca tiene para ofrecer.<br>
                    ¡Embellece tu vida con nosotros!
                </p>
                
                <div class="opciones-container">
                    <div class="opcion">
                        <div class="img-container">
                            <img src="/src/images/salon2.jpg" alt="Proveedor" class="img-opcion" />
                            <router-link to="/registro">
                                <button class="btn-opcion">
                                    Puedes unirte como proveedor y ofrecer tus servicios
                                </button>
                            </router-link>
                        </div>
                    </div>
                    
                    <div class="opcion">
                        <div class="img-container">
                            <img src="/src/images/cabello3.jpg" alt="Cliente" class="img-opcion" />
                            <router-link to="/registro">
                                <button class="btn-opcion">
                                    Únete para explorar y agenda citas en cuestión de minutos
                                </button>
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Sección de Categorías -->
        <section class="categorias-section">
            <div class="categorias-wrapper">
                <h2 class="categorias-titulo">Explora nuestras categorías</h2>
                
                <div class="categorias-grid">
                    <div 
                        class="categoria-card" 
                        v-for="categoria in categorias" 
                        :key="categoria.id"
                        :style="{ backgroundImage: `url(${categoria.imagen})` }"
                    >
                        <div class="categoria-overlay"></div>
                        <div class="categoria-content">
                            <h3 class="categoria-nombre">{{ categoria.nombre }}</h3>
                            <p class="categoria-descripcion">{{ categoria.descripcion }}</p>
                            <router-link to="/serviciosCatalogo" class="btn-categoria">
                                Explorar
                            </router-link>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        <!-- Sección de Texto Explicativo -->
        <section class="explicacion-section">
            <div class="explicacion-wrapper">
                <h2 class="explicacion-titulo">Tu belleza, nuestra prioridad</h2>
                <p class="explicacion-texto">
                    En <strong>OaxacaGlow</strong>, creemos que el cuidado personal es fundamental para tu bienestar. 
                    Nuestra plataforma conecta a los mejores profesionales de belleza y estética de Oaxaca 
                    con personas que buscan sentirse y verse increíbles.
                </p>
                <p class="explicacion-texto">
                    Ya sea que necesites un corte de cabello elegante, un masaje relajante, un facial revitalizante 
                    o un maquillaje profesional, aquí encontrarás el servicio perfecto para ti. 
                    Agenda tus citas de forma rápida, segura y sin complicaciones.
                </p>
                <p class="explicacion-destacada">
                    ✨ Porque cuidarte es quererte, y en OaxacaGlow estamos aquí para acompañarte en ese camino.
                </p>
            </div>
        </section>
    </div>
</template>

<script>
export default {
    name: "Home",
    data() {
        return {
            categorias: [
                { 
                    id: 1, 
                    nombre: 'Spa', 
                    descripcion: 'Relájate y renueva tu energía',
                    imagen: '/src/images/spa1.jpg'
                },
                { 
                    id: 2, 
                    nombre: 'Cabello', 
                    descripcion: 'Estilos y tratamientos capilares',
                    imagen: '/src/images/cabello1.jpg'
                },
                { 
                    id: 3, 
                    nombre: 'Masaje', 
                    descripcion: 'Alivia tensiones y estrés',
                    imagen: '/src/images/masaje1.jpg'
                },
                { 
                    id: 4, 
                    nombre: 'Facial', 
                    descripcion: 'Cuida y embellece tu rostro',
                    imagen: '/src/images/facial1.jpg'
                },
                { 
                    id: 5, 
                    nombre: 'Uñas', 
                    descripcion: 'Manicure y pedicure profesional',
                    imagen: '/src/images/unas1.jpg'
                },
                { 
                    id: 6, 
                    nombre: 'Maquillaje', 
                    descripcion: 'Resalta tu belleza natural',
                    imagen: '/src/images/maquillaje1.jpg'
                }
            ]
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

.home-page {
    width: 100%;
}

/* Hero fullscreen */
.hero-fullscreen {
    width: 100%;
    height: 100vh; 
    background-image: url("/src/images/img3.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    position: relative;
}

/* Overlay */
.hero-overlay {
    position: absolute;
    top: 250px;
    right: 4%;
    text-align: center;
    z-index: 1;
    padding: 0;
    background: transparent;
    backdrop-filter: none;
}

/* Título */
.hero-title {
    font-size: 3.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 1rem;
    text-shadow: 
        2px 2px 4px rgba(0, 0, 0, 0.8),
        0 0 10px rgba(0, 0, 0, 0.5);
}

/* Subtítulo */
.hero-subtitle {
    font-size: 1.5rem;
    color: white;
    margin-bottom: 2rem;
    text-shadow: 
        1px 1px 3px rgba(0, 0, 0, 0.8),
        0 0 8px rgba(0, 0, 0, 0.4);
}

/* Botón píldora */
.btn-hero {
    display: inline-block;
    padding: 16px 40px;
    font-size: 1.2rem;
    font-weight: 600;
    color: white;
    background: #4E4E4E;
    border: none;
    border-radius: 50px;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.4s ease;
    box-shadow: 
        0 6px 20px rgba(0, 0, 0, 0.5),
        0 0 15px rgba(0, 0, 0, 0.3);
}

.btn-hero:hover {
    background: #1a1a1a;
    transform: translateY(-4px);
    box-shadow: 
        0 10px 30px rgba(0, 0, 0, 0.7),
        0 0 20px rgba(0, 0, 0, 0.5);
}

/* Sección de contenido */
.content-section {
    padding: 80px 20px;
    background: var(--lavanda-clara);
    text-align: center;
}

.content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
}

.titulo-bienvenida {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 30px;
    color: var(--morado-suave);
}

.descripcion-home {
    font-size: 1.3rem;
    line-height: 2.2rem;
    color: var(--gris-humo);
    margin-bottom: 60px;
}

.opciones-container {
    display: flex;
    justify-content: center;
    gap: 60px;
    flex-wrap: wrap;
}

.opcion {
    display: flex;
    flex-direction: column;
    align-items: center;
}

.img-container {
    position: relative;
    width: 460px;
    height: 300px;
}

.img-opcion {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 20px;
    box-shadow: 0 4px 16px rgba(139, 95, 191, 0.2);
}

.btn-opcion {
    position: absolute;
    bottom: 18px;
    left: 50%;
    transform: translateX(-50%);
    padding: 14px 20px;
    max-width: 280px;
    font-size: 1.05rem;
    border: none;
    border-radius: 8px;
    background: var(--lila-pastel);
    color: white;
    cursor: pointer;
    font-weight: 600;
    box-shadow: 0 7px 19px rgba(255, 255, 255, 0.4);
    transition: all 0.3s ease;
    line-height: 1.4;
}

.btn-opcion:hover {
    background: var(--morado-suave);
    box-shadow: 0 6px 20px rgba(139, 95, 191, 0.5);
    transform: translateX(-50%) translateY(-2px);
}

/* ============================================ */
/* SECCIÓN DE CATEGORÍAS */
/* ============================================ */
.categorias-section {
    padding: 80px 20px;
    background: linear-gradient(135deg, var(--morado-suave) 0%, var(--lila-pastel) 100%);
}

.categorias-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
}

.categorias-titulo {
    font-size: 3rem;
    font-weight: bold;
    color: rgb(68, 67, 68);
    margin-bottom: 60px;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

/* Grid de categorías - 3 columnas */
.categorias-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    max-width: 1000px;
    margin: 0 auto;
}

/* Card de categoría CON IMAGEN DE FONDO */
.categoria-card {
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 20px;
    padding: 40px 20px;
    min-height: 250px;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    position: relative;
    overflow: hidden;
    transition: all 0.4s ease;
    cursor: pointer;
}

/* Overlay oscuro sobre la imagen */
.categoria-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: transparent; /* Morado translúcido */
    backdrop-filter: blur(1px);
    transition: all 0.4s ease;
    z-index: 1;
}

.categoria-card:hover .categoria-overlay {
    background: rgba(139, 95, 191, 0.3); /* Más transparente al hover */
    backdrop-filter: blur(1px);
}

.categoria-card:hover {
    border-color: white;
    transform: translateY(-10px) scale(1.05);
    box-shadow: 0 15px 40px rgba(0, 0, 0, 0.4);
}

.categoria-content {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
}

.categoria-nombre {
    font-size: 2rem;
    font-weight: 700;
    color: white;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 1px;
}

.categoria-descripcion {
    font-size: 1rem;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    line-height: 1.5;
}

/* Botón píldora blanco */
.btn-categoria {
    display: inline-block;
    padding: 12px 30px;
    font-size: 1rem;
    font-weight: 600;
    color: white;
    background: transparent;
    border: 2px solid white;
    border-radius: 50px;
    text-decoration: none;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-top: 10px;
}

.btn-categoria:hover {
    background: white;
    color: var(--morado-suave);
    transform: scale(1.1);
    box-shadow: 0 4px 15px rgba(255, 255, 255, 0.5);
}

/* ============================================ */
/* SECCIÓN EXPLICATIVA */
/* ============================================ */
.explicacion-section {
    padding: 80px 20px;
    background: var(--blanco);
}

.explicacion-wrapper {
    max-width: 900px;
    margin: 0 auto;
    text-align: center;
}

.explicacion-titulo {
    font-size: 2.5rem;
    font-weight: bold;
    color: var(--morado-suave);
    margin-bottom: 40px;
}

.explicacion-texto {
    font-size: 1.2rem;
    line-height: 2rem;
    color: var(--gris-humo);
    margin-bottom: 25px;
    text-align: justify;
}

.explicacion-destacada {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--morado-suave);
    margin-top: 40px;
    padding: 20px;
    background: var(--lavanda-clara);
    border-radius: 15px;
    border-left: 5px solid var(--lila-pastel);
}

/* ============================================ */
/* RESPONSIVE - TABLET (768px - 1024px) */
/* ============================================ */
@media (max-width: 1024px) {
    .hero-overlay {
        top: 120px;
        right: 5%;
    }
    
    .hero-title {
        font-size: 3rem;
    }
    
    .hero-subtitle {
        font-size: 1.3rem;
    }
    
    .btn-hero {
        padding: 14px 35px;
        font-size: 1.1rem;
    }
    
    .categorias-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 25px;
    }
    
    .categorias-titulo {
        font-size: 2.5rem;
    }
}

/* ============================================ */
/* RESPONSIVE - MÓVIL HORIZONTAL (768px) */
/* ============================================ */
@media (max-width: 768px) {
    .hero-fullscreen {
        height: 70vh;
    }
    
    .hero-overlay {
        top: 50%;
        left: 50%;
        right: auto;
        transform: translate(-50%, -50%);
        max-width: 90%;
    }
    
    .hero-title {
        font-size: 2.5rem;
    }
    
    .hero-subtitle {
        font-size: 1.2rem;
    }
    
    .btn-hero {
        padding: 12px 32px;
        font-size: 1rem;
    }
    
    .titulo-bienvenida {
        font-size: 2.2rem;
    }
    
    .descripcion-home {
        font-size: 1.1rem;
        line-height: 1.8rem;
    }
    
    .opciones-container {
        flex-direction: column;
        gap: 30px;
    }
    
    .img-container {
        width: 100%;
        max-width: 400px;
    }
    
    .categorias-grid {
        grid-template-columns: repeat(2, 1fr);
        gap: 20px;
    }
    
    .categoria-card {
        min-height: 220px;
        padding: 30px 15px;
    }
    
    .categoria-nombre {
        font-size: 1.5rem;
    }
    
    .explicacion-titulo {
        font-size: 2rem;
    }
    
    .explicacion-texto {
        font-size: 1.1rem;
        text-align: center;
    }
}

/* ============================================ */
/* RESPONSIVE - MÓVIL VERTICAL (480px) */
/* ============================================ */
@media (max-width: 480px) {
    .hero-fullscreen {
        height: 60vh;
    }
    
    .hero-overlay {
        max-width: 85%;
    }
    
    .hero-title {
        font-size: 2rem;
        margin-bottom: 0.75rem;
    }
    
    .hero-subtitle {
        font-size: 1rem;
        margin-bottom: 1.5rem;
    }
    
    .btn-hero {
        padding: 10px 28px;
        font-size: 0.95rem;
    }
    
    .content-section {
        padding: 40px 15px;
    }
    
    .titulo-bienvenida {
        font-size: 1.8rem;
    }
    
    .descripcion-home {
        font-size: 1rem;
        line-height: 1.6rem;
        margin-bottom: 40px;
    }
    
    .img-container {
        height: 250px;
    }
    
    .btn-opcion {
        font-size: 0.95rem;
        padding: 12px 16px;
        max-width: 240px;
    }
    
    .categorias-section {
        padding: 50px 15px;
    }
    
    .categorias-grid {
        grid-template-columns: 1fr;
        gap: 20px;
    }
    
    .categorias-titulo {
        font-size: 2rem;
        margin-bottom: 40px;
    }
    
    .categoria-card {
        min-height: 200px;
    }
    
    .categoria-nombre {
        font-size: 1.8rem;
    }
    
    .explicacion-section {
        padding: 50px 15px;
    }
    
    .explicacion-titulo {
        font-size: 1.8rem;
    }
    
    .explicacion-texto {
        font-size: 1rem;
        line-height: 1.7rem;
    }
    
    .explicacion-destacada {
        font-size: 1.2rem;
    }
}

/* ============================================ */
/* RESPONSIVE - MÓVIL PEQUEÑO (360px) */
/* ============================================ */
@media (max-width: 360px) {
    .hero-title {
        font-size: 1.7rem;
    }
    
    .hero-subtitle {
        font-size: 0.9rem;
    }
    
    .btn-hero {
        padding: 8px 24px;
        font-size: 0.9rem;
    }
    
    .titulo-bienvenida {
        font-size: 1.5rem;
    }
    
    .descripcion-home {
        font-size: 0.95rem;
    }
    
    .img-container {
        height: 220px;
    }
    
    .categoria-nombre {
        font-size: 1.5rem;
    }
    
    .categoria-descripcion {
        font-size: 0.9rem;
    }
}

/* ============================================ */
/* RESPONSIVE - PANTALLAS GRANDES (1440px+) */
/* ============================================ */
@media (min-width: 1440px) {
    .hero-overlay {
        top: 200px;
        right: 8%;
    }
    
    .hero-title {
        font-size: 4rem;
    }
    
    .hero-subtitle {
        font-size: 1.8rem;
    }
    
    .btn-hero {
        padding: 18px 50px;
        font-size: 1.3rem;
    }
    
    .titulo-bienvenida {
        font-size: 3.5rem;
    }
    
    .descripcion-home {
        font-size: 1.5rem;
        line-height: 2.5rem;
    }
    
    .img-container {
        width: 520px;
        height: 350px;
    }
    
    .categorias-titulo {
        font-size: 3.5rem;
    }
    
    .categoria-card {
        min-height: 280px;
    }
}
</style>
