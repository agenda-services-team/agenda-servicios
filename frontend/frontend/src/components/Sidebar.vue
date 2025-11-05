<template>
    <aside class="sidebar">
        <div class="user-info">
            <img src="../assets/logo.png" alt="Logo" class="logo" />
            <p>Hola, nameService</p>
        </div>
        <nav class="menu">
            <router-link to="/dashboard" class="menu-item" exact-active-class="router-link-active">
                <i class="icon">🏠</i> Inicio
            </router-link>
            <router-link to="/dashboard/agenda" class="menu-item">
                <i class="icon">📅</i> Agenda
            </router-link>
            <router-link to="/dashboard/servicios" class="menu-item">
                <i class="icon">💇</i> Servicios
            </router-link>
            <!-- Comentado hasta que se definan las rutas -->
            <router-link to="/galeria" class="menu-item">
                <i class="icon">🖼️</i> Galería
            </router-link>
            <router-link to="/configuracion" class="menu-item">
                <i class="icon">⚙️</i> Configuración
            </router-link>
        </nav>
    </aside>
</template>
<script>
</script>

<style scoped>
.sidebar {
    width: 230px;
    background-color: #f3eaff;
    height: 100vh;
    padding: 20px;
    display: flex;
    flex-direction: column;
}

.user-info {
    text-align: center;
    margin-bottom: 40px;
}

.logo {
    max-width: 100px;
}

.menu-item {
    display: block;
    padding: 10px 0;
    color: #333;
    text-decoration: none;
}

.menu-item.router-link-active {
    color: #7e57c2;
    font-weight: bold;
}
</style>