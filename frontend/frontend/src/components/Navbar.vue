<template>
    <header class="navbar">
        <!-- imagen del logo -->
        <div class="navbar-left">
            <img src="/src/assets/logo.png" alt="Logo" class="logo" />
            <h1 class="brand-name">OaxacaGlow </h1>
        </div>

        <!-- botones para iniicar sesion o unirte-->
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
.navbar {
    background: #F6FBFB;
    padding: 15px 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 2px solid #ddd;
}

/* Lado izquierdo */
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

/* Lado derecho */
.navbar-right {
    display: flex;
    gap: 15px;
}

/* Botones */
.btn {
    padding: 8px 15px;
    border-radius: 6px;
    text-decoration: none;
    font-weight: 500;
    transition: 0.3s;
}

/* Botón "Unirme" */
.btn {
    background: #FCE9EE;
    color: #791236;
    border: 4px solid #FCE9EE;
}

.btn:hover {
    background: #FCE9EE;
    border-color: #FCE9EE;
}

/* Botón "Iniciar sesión" */
.btn-primary {
    background: transparent;
    color: #791236;
    border: 4px solid #FCE9EE;

}

.btn-primary:hover {
    background: #FCE9EE;
}
</style>
