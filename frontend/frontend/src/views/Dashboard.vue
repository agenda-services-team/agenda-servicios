<template>
    <div class="dashboard-layout">
        <aside class="sidebar">
            <div class="sidebar-logo">
                <img src="/src/assets/logo.png" alt="Logo" />
            </div>
            <div class="sidebar-user">
                <span class="user-name">{{ nombreUsuario }}</span>
            </div>
            <nav class="sidebar-menu">
                <router-link to="/servicios" class="sidebar-link" active-class="active">Inicio</router-link>
                <router-link to="/agenda" class="sidebar-link" active-class="active">Agenda</router-link>
                <router-link to="/servicios" class="sidebar-link" active-class="active">Servicios</router-link>
                <router-link to="/galeria" class="sidebar-link" active-class="active">Galería</router-link>
                <router-link to="/configuracion" class="sidebar-link" active-class="active">Configuración</router-link>
            </nav>
        </aside>
        <main class="dashboard-content">
            <router-view />
        </main>
    </div>
</template>

<script>
export default {
    data() {
        return {
            nombreUsuario: ''
        }
    },
    mounted() {
        // Se obtiene el nombre del usuario desde localStorage
        const usuario = JSON.parse(localStorage.getItem('usuario'));
        this.nombreUsuario = usuario?.nombre || 'Usuario';
    }
}
</script>

<style scoped>
.dashboard-layout {
    display: flex;
    min-height: 100vh;
    align-items: stretch;
}

.sidebar {
    width: 240px;
    background: #f6fbfb;
    border-right: 2px solid #eee;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 32px 0 0 0;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    height: 100vh;
    z-index: 10;
}

.sidebar-logo {
    width: 100%;
    display: flex;
    justify-content: center;
}

.sidebar-logo img {
    width: 90px;
    margin-bottom: 18px;
}

.sidebar-user {
    width: 100%;
    margin-bottom: 32px;
    font-size: 1.1em;
    color: #791236;
    font-weight: bold;
    text-align: center;
}

.sidebar-menu {
    display: flex;
    flex-direction: column;
    width: 100%;
    gap: 8px;
}

.sidebar-link {
    display: block;
    width: 100%;
    padding: 12px 0 12px 32px;
    color: #791236;
    text-decoration: none;
    font-size: 1.08em;
    border-left: 4px solid transparent;
    transition: background 0.2s, border-color 0.2s;
}

.sidebar-link.active,
.sidebar-link:hover {
    background: #fce9ee;
    border-left: 4px solid #791236;
    color: #791236;
}

.dashboard-content {
    flex: 1;
    margin-left: 240px;
    padding: 40px;
    background: #fff;
    min-height: 100vh;
}
</style>
