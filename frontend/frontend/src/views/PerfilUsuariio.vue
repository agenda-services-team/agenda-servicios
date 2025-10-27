<template>
    <div class="perfil-page">
        <header class="page-header">
            <h1>Mi Perfil</h1>
            <p>Próximamente podrás editar tu perfil aquí</p>
        </header>
        <div class="placeholder-content">
            <p>🚧 Esta sección está en desarrollo</p>
            <button @click="$router.back()" class="back-btn">Volver</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'PerfilUsuario'
}
</script>

<style scoped>
.perfil-page {
    padding: 2rem;
    max-width: 1200px;
    margin: 0 auto;
}

.placeholder-content {
    text-align: center;
    padding: 4rem 2rem;
    background: #f5f5f5;
    border-radius: 12px;
    margin-top: 2rem;
}

.back-btn {
    background: #791236;
    color: white;
    border: none;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    cursor: pointer;
    margin-top: 1rem;
}
</style>