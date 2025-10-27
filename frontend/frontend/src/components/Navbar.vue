<!-- src/components/Navbar.vue -->
<template>
    <header class="navbar" v-if="showNavbar">
        <!-- Logo -->
        <div class="navbar-left">
            <img src="/src/assets/logo.png" alt="Logo" class="logo" />
            <h1 class="brand-name">OaxacaGlow</h1>
        </div>

        <!-- Botones públicos -->
        <div class="navbar-right">
            <router-link to="/registro" class="btn">Unirme</router-link>
            <router-link to="/login" class="btn btn-primary">Iniciar sesión</router-link>
        </div>
    </header>
</template>

<script>
export default {
    name: "Navbar",
    computed: {
        showNavbar() {
            // Ocultar en páginas internas o protegidas
            const hiddenRoutes = ["/login", "/registro", "/dashboard", "/servicios"];
            return !hiddenRoutes.some((r) => this.$route.path.startsWith(r));
        },
    },
};
</script>

<style scoped>
.navbar {
    background: #f6fbfb;
    padding: 15px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #ddd;
}

.navbar-left {
    display: flex;
    align-items: center;
}

.logo {
    height: 40px;
    margin-right: 10px;
}

.brand-name {
    font-size: 20px;
    font-weight: bold;
    color: #333;
}

.navbar-right {
    display: flex;
    gap: 15px;
}

.btn {
    padding: 8px 15px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    transition: 0.3s;
    background: #fce9ee;
    color: #791236;
    border: 4px solid #fce9ee;
}

.btn:hover {
    background: #fce9ee;
    border-color: #fce9ee;
}

.btn-primary {
    background: transparent;
    color: #791236;
    border: 4px solid #fce9ee;
}

.btn-primary:hover {
    background: #fce9ee;
}
</style>
