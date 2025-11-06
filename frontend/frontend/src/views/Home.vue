<template>  
    <div class="home-page">
        <!-- Imagen fullscreen -->
        <section class="hero-fullscreen"></section>

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
                            <img src="/src/images/imagenProv.png" alt="Proveedor" class="img-opcion" />
                            <router-link to="/registro">
                                <button class="btn-opcion">
                                    Puedes unirte como proveedor y ofrecer tus servicios
                                </button>
                            </router-link>
                        </div>
                    </div>
                    
                    <div class="opcion">
                        <div class="img-container">
                            <img src="/src/images/imagenCli.jpg" alt="Cliente" class="img-opcion" />
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
    </div>
</template>

<script>
export default {
    name: "Home"
}
</script>

<style scoped>

:root {
    --lavanda-clara: #F3EDFF;
    --lila-pastel: #CBA6F7;
    --morado-suave: #8B5FBF;
    --gris-humo: #4E4E4E;
    --blanco: #FFFFFF;
}

/* Contenedor principal */
.home-page {
    width: 100%;
}

/* Hero fullscreen - CORREGIDO */
.hero-fullscreen {
    width: 100%;
    height: 100vh; 
    background-image: url("/src/images/img3.jpg"); /* ✅ Ruta corregida */
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
}

/* Sección de contenido */
.content-section {
    padding: 80px 20px;
    background: #fff;
    text-align: center;
}

.content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
}

/* Textos */
.titulo-bienvenida {
    font-size: 3rem;
    font-weight: bold;
    margin-bottom: 30px;
    color: #333;
}

.descripcion-home {
    font-size: 1.3rem;
    line-height: 2.2rem;
    color: #555;
    margin-bottom: 60px;
}

/* Opciones */
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
    box-shadow: 0 2px 12px rgba(0, 0, 0, 0.13);
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
    background: rgba(255, 247, 247, 0.95);
    color: #111;
    cursor: pointer;
    font-weight: 600;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    transition: all 0.3s ease;
    line-height: 1.4;
}

.btn-opcion:hover {
    background: rgba(243, 214, 224, 0.98);
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
    transform: translateX(-50%) translateY(-2px);
}

/* Responsive */
@media (max-width: 768px) {
    .hero-fullscreen {
        height: 70vh;
    }
    
    .titulo-bienvenida {
        font-size: 2rem;
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
    
    .btn-opcion {
        font-size: 0.95rem;
    }
}

@media (max-width: 480px) {
    .content-section {
        padding: 40px 15px;
    }
    
    .titulo-bienvenida {
        font-size: 1.8rem;
    }
    
    .img-container {
        height: 250px;
    }
}
</style>
