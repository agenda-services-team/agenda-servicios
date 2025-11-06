<template>
    <header class="header-servicios">
        <div class="header-container">
            <!-- Logo a la izquierda -->
            <div class="logo">
                <router-link to="/">
                    <img :src="logoUrl" alt="OaxacaGlow Logo" class="logo-img" />
                </router-link>
            </div>
            
            <!-- Espacio central -->
            <div class="spacer"></div>
            
            <!-- Acciones a la derecha -->
            <div class="header-actions">
                <!-- Próximamente: notificaciones, perfil, etc. -->
            </div>
        </div>
    </header>
</template>

<script>
export default {
    name: 'HeaderServicios',
    data() {
        return {
            // Importa la imagen dinámicamente
            logoUrl: new URL('../images/logo.png', import.meta.url).href
        }
    }
}
</script>

<style scoped>
.header-servicios {
    width: 100%;
    position: sticky;
    top: 0;
    z-index: 1000;
    background: white;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.header-container {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    padding: 1rem 2rem;
    max-width: 100%;
}

.logo {
    grid-column: 1;
    display: flex;
    align-items: center;
}

.logo a {
    display: flex;
    align-items: center;
    text-decoration: none;
}

.logo-img {
    height: 50px;           /* Ajusta según necesites */
    width: auto;            /* Mantiene proporción */
    object-fit: contain;    /* No distorsiona */
    cursor: pointer;
}

.logo a:hover .logo-img {
    opacity: 0.8;
    transition: opacity 0.3s ease;
}

.spacer {
    grid-column: 2;
}

.header-actions {
    grid-column: 3;
    display: flex;
    gap: 1rem;
    align-items: center;
}

/* Responsive */
@media (max-width: 768px) {
    .header-container {
        padding: 0.75rem 1rem;
    }
    
    .logo-img {
        height: 40px;
    }
}

@media (max-width: 480px) {
    .logo-img {
        height: 35px;
    }
}
</style>