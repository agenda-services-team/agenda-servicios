<template>
    <aside class="sidebar">
        <div class="user-info">
            <img :src="logoEmprendimiento || '../assets/logo.png'" alt="Logo" class="logo" />
            <p v-if="nombreNegocio">Hola, {{ nombreNegocio }}</p>
            <p v-else>Hola 👋</p>
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
            <router-link to="/dashboard/galeria" class="menu-item">
                <i class="icon">🖼️</i> Galería
            </router-link>
            <router-link to="/dashboard/configuracion" class="menu-item">
                <i class="icon">⚙️</i> Configuración
            </router-link>
        </nav>
    </aside>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const nombreNegocio = ref('')
const logoEmprendimiento = ref(null)

// Se obtiene el id del usuario que esta logueado
const idUsuario = localStorage.getItem('id_usuario')

onMounted(async () => {
    if (!idUsuario) return

    try {
        const response = await fetch(`http://localhost:4000/api/emprendimientos/usuario/${idUsuario}`)
        const data = await response.json()
        console.log('Datos del emprendimiento:', data)
        if (data.tieneEmprendimiento) {
            nombreNegocio.value = data.nombre_negocio
            logoEmprendimiento.value = data.logo
        }
    } catch (error) {
        console.error('Error al obtener emprendimiento:', error)
    }
})
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
    border-radius: 10px;
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
