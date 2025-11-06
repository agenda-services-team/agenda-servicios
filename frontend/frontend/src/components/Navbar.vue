<template>
    <header class="navbar">
        <!-- imagen del logo -->
        <div class="navbar-left">
            <img src="/src/images/LogoApp.png" alt="Logo" class="logo" />
            <h1 class="brand-name">OaxacaGlow</h1>
        </div>

        <!-- botones para iniciar sesión o unirte -->
        <div class="navbar-right">
            <router-link to="/registro" class="btn">Unirme</router-link>
            <router-link to="/login" class="btn btn-primary">Iniciar sesión</router-link>
        </div>
    </header>
</template>

<script>
export default {
    name: "Navbar"
}
</script>

<style scoped>
/* Paleta de colores morados */
:root {
    --lavanda-clara: #F3EDFF;
    --lila-pastel: #CAA6F7;
    --morado-suave: #8B5FBF;
    --gris-humo: #4E4E4E;
    --blanco: #FFFFFF;
}

.navbar {
    background: var(--blanco);
    padding: 15px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid var(--lavanda-clara);
    box-shadow: 0 2px 8px rgba(139, 95, 191, 0.1);
}

/* Lado izquierdo */
.navbar-left {
    display: flex;
    align-items: center;
    gap: 12px;
}

.logo {
    height: 45px;
    width: auto;
}

.brand-name {
    font-size: 22px;
    font-weight: 700;
    color: var(--morado-suave);
    letter-spacing: 0.5px;
}

/* Lado derecho */
.navbar-right {
    display: flex;
    gap: 15px;
}

/* Botones base */
.btn {
    padding: 10px 20px;
    border-radius: 8px;
    text-decoration: none;
    font-weight: 600;
    font-size: 0.95rem;
    transition: all 0.3s ease;
    border: 2px solid transparent;
}

/* Botón "Unirme" - Fondo lila */
.btn {
    background: var(--lila-pastel);
    color: var(--blanco);
    border-color: var(--lila-pastel);
}

.btn:hover {
    background: var(--morado-suave);
    border-color: var(--morado-suave);
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(139, 95, 191, 0.3);
}

/* Botón "Iniciar sesión" - Outline */
.btn-primary {
    background: transparent;
    color: var(--morado-suave);
    border: 2px solid var(--lila-pastel);
}

.btn-primary:hover {
    background: var(--lavanda-clara);
    border-color: var(--morado-suave);
    color: var(--morado-suave);
}

/* Responsive */
@media (max-width: 768px) {
    .navbar {
        padding: 12px 20px;
    }
    
    .logo {
        height: 38px;
    }
    
    .brand-name {
        font-size: 18px;
    }
    
    .btn {
        padding: 8px 16px;
        font-size: 0.9rem;
    }
}

@media (max-width: 480px) {
    .navbar-left {
        gap: 8px;
    }
    
    .brand-name {
        font-size: 16px;
    }
    
    .navbar-right {
        gap: 10px;
    }
    
    .btn {
        padding: 6px 12px;
        font-size: 0.85rem;
    }
}
</style>
