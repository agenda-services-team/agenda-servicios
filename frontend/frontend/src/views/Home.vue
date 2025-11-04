<!-- src/views/Home.vue - VERSIÓN CORREGIDA -->
<template>
    <div class="home-page">
        <!-- Navbar se renderiza automáticamente desde App.vue -->
        <main class="main-content">
            <h2 class="titulo-bienvenida">Bienvenido a OaxacaGlow</h2>
            <p class="descripcion-home">
                El sitio perfecto donde puedes explorar los diversos<br class="desktop-only">
                servicios estéticos que Oaxaca tiene para ofrecer.<br class="desktop-only">
                ¡Embellece tu vida con nosotros!
            </p>
            <div class="opciones-container">
                <div class="opcion">
                    <div class="img-container">
                        <img src="/src/images/imagenProv.png" alt="Proveedores de servicios" class="img-opcion" />
                        <router-link to="/registro">
                            <button class="btn-opcion">Únete como proveedor y ofrece tus servicios</button>
                        </router-link>
                    </div>
                </div>
                <div class="opcion">
                    <div class="img-container">
                        <img src="/src/images/imagenCli.jpg" alt="Clientes" class="img-opcion" />
                        <router-link to="/registro">
                            <button class="btn-opcion">Explora y agenda citas en minutos para servicios estéticos</button>
                        </router-link>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
export default {
    name: "Home"
}
</script>

<style scoped>
.home-page {
    min-height: 100vh;
    width: 100%;
}

.main-content {
    padding: 0;
    text-align: center;
    background-image: url("/src/images/fondoInicio.png");
    background-size: cover;
    background-position: center;
    background-attachment: fixed;
    min-height: 100vh;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
    overflow: hidden;
    /* Ajuste importante: padding-top para el navbar */
    padding: 80px 20px 40px;
}

/* CORRECCIÓN: Eliminar el z-index alto y ajustar el overlay */
.main-content::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.7);
    /* z-index removido o reducido */
    z-index: 0; /* Cambiado de 1 a 0 */
}

/* CORRECCIÓN: Ajustar z-index del contenido */
.main-content > * {
    position: relative;
    z-index: 1; /* Reducido de 2 a 1 */
}

/* Título responsive */
.titulo-bienvenida {
    font-size: clamp(2rem, 6vw, 3.5rem);
    font-weight: bold;
    margin-bottom: 1.5rem;
    color: #333;
    line-height: 1.2;
}

/* Descripción responsive */
.descripcion-home {
    font-size: clamp(1rem, 3vw, 1.3rem);
    line-height: 1.6;
    max-width: 90%;
    margin: 0 auto 2.5rem;
    color: #555;
}

.desktop-only {
    display: none;
}

/* Contenedor de opciones responsive */
.opciones-container {
    display: flex;
    flex-direction: column;
    gap: 2rem;
    width: 100%;
    max-width: 1200px;
    margin: 0 auto;
}

/* Opciones individuales */
.opcion {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
}

.img-container {
    position: relative;
    width: 100%;
    max-width: 500px;
    height: 300px;
    display: flex;
    justify-content: center;
    align-items: center;
    margin: 0 auto;
}

.img-opcion {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

/* Botones responsive */
.btn-opcion {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    padding: 14px 20px;
    width: 90%;
    max-width: 280px;
    font-size: clamp(0.9rem, 2.5vw, 1.1rem);
    border: none;
    border-radius: 10px;
    background: rgba(255, 247, 247, 0.95);
    color: #111;
    cursor: pointer;
    transition: all 0.3s ease;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
    backdrop-filter: blur(10px);
    margin: 0;
    display: block;
    z-index: 2; /* Este z-index está bien para los botones */
    line-height: 1.4;
}

.btn-opcion:hover {
    background: rgba(243, 214, 224, 0.95);
    box-shadow: 0 6px 20px rgba(0, 0, 0, 0.25);
    transform: translateX(-50%) translateY(-2px);
}

/* ========== MEDIA QUERIES ========== */

/* Tabletas (≥768px) */
@media (min-width: 768px) {
    .main-content {
        padding: 100px 40px 60px;
    }
    
    .opciones-container {
        flex-direction: row;
        gap: 2rem;
    }
    
    .opcion {
        flex: 1;
    }
    
    .img-container {
        height: 350px;
    }
    
    .btn-opcion {
        width: 80%;
    }
    
    .desktop-only {
        display: inline;
    }
}

/* Desktop (≥1024px) */
@media (min-width: 1024px) {
    .main-content {
        padding: 120px 60px 80px;
    }
    
    .opciones-container {
        gap: 3rem;
    }
    
    .img-container {
        height: 400px;
        max-width: 600px;
    }
    
    .btn-opcion {
        font-size: 1.1rem;
        padding: 16px 24px;
    }
    
    .descripcion-home {
        max-width: 700px;
    }
}

/* Pantallas grandes (≥1280px) */
@media (min-width: 1280px) {
    .opciones-container {
        gap: 4rem;
    }
    
    .img-container {
        height: 450px;
    }
}

/* Móviles pequeños (≤480px) */
@media (max-width: 480px) {
    .main-content {
        padding: 80px 15px 30px;
    }
    
    .img-container {
        height: 250px;
    }
    
    .btn-opcion {
        padding: 12px 16px;
        font-size: 0.85rem;
        width: 95%;
    }
    
    .titulo-bienvenida {
        margin-bottom: 1rem;
    }
    
    .descripcion-home {
        margin-bottom: 2rem;
        line-height: 1.5;
    }
}

/* Orientación landscape en móviles */
@media (max-height: 600px) and (orientation: landscape) {
    .main-content {
        padding: 80px 20px 30px;
        min-height: auto;
    }
    
    .img-container {
        height: 200px;
    }
    
    .opciones-container {
        flex-direction: row;
        gap: 1rem;
    }
}
</style>