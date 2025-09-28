<template>
    <div class="login-page">
        <!-- Navbar para login -->
        <nav class="login-navbar">
            <div class="nav-left">
                <button class="icon-btn" @click="$router.back()" aria-label="Regresar">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#791236" stroke-width="2.5"
                        stroke-linecap="round" stroke-linejoin="round">
                        <path d="M15 18l-6-6 6-6" />
                    </svg>
                </button>
            </div>
            <div class="nav-center">OaxacaGlow</div>
            <div class="nav-right">
                <button class="icon-btn" aria-label="Ayuda">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#791236" stroke-width="2.2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 1 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12" y2="17" />
                    </svg>
                </button>
            </div>
        </nav>

        <!-- Logo abajo del navbar -->
        <div class="logo-center">
            <img src="/src/assets/logo.png" alt="Logo" class="login-logo" />
        </div>

        <!-- Cliente o proveedor -->
        <div class="user-type-selector">
            <button :class="{ active: tipoUsuario === 'cliente' }" @click="tipoUsuario = 'cliente'">Cliente</button>
            <button :class="{ active: tipoUsuario === 'proveedor' }"
                @click="tipoUsuario = 'proveedor'">Proveedor</button>
        </div>

        <!-- Formulario de login -->
        <form class="login-form" @submit.prevent="login">
            <input v-model="correo" type="email" placeholder="Correo electrónico" required />
            <input v-model="contrasena" type="password" placeholder="Contraseña" required />
            <button type="submit">Ingresar</button>
            <p class="login-message">{{ mensaje }}</p>
        </form>
        <div class="register-link">
            ¿No tienes una cuenta?
            <router-link to="/registro" class="unirme-link">Unirme</router-link>
        </div>
        <Footer />
    </div>
</template>

<script>
import axios from 'axios';
import Footer from './Footer.vue';
export default {
    components: { Footer },
    data() {
        return {
            correo: '',
            contrasena: '',
            mensaje: '',
            tipoUsuario: 'cliente',
        }
    },
    methods: {
        async login() {
            try {
                //Se puede enviar el  tipoUsuario si lo necesito mas adelante
                const res = await axios.post('http://localhost:4000/api/usuarios/login', {
                    correo: this.correo,
                    contrasena: this.contrasena
                });
                localStorage.setItem('token', res.data.token);
                // Redirigir según sea el tipo de usuario
                const tipo = res.data.usuario?.tipo_usuario;
                if (tipo === 'cliente') {
                    this.$router.push('/servicios');
                } else if (tipo === 'prestador' || tipo === 'proveedor') {
                    this.$router.push('/dashboard');
                } else {
                    this.$router.push('/');
                }
            } catch (err) {
                this.mensaje = err.response?.data || 'Error al iniciar sesión';
            }
        }
    }
}
</script>

<style scoped>
.login-page {
    min-height: 100vh;
    background: #f6fbfb;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    padding-top: 40px;
}


.login-navbar {
    width: 100vw;
    background: #f6fbfb;
    border-bottom: 2px solid #ddd;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    padding: 0 18px;
    box-sizing: border-box;
}

.nav-left,
.nav-center,
.nav-right {
    display: flex;
    align-items: center;
}

.nav-center {
    flex: 1;
    justify-content: center;
    font-size: 1.4em;
    font-weight: bold;
    color: #791236;
    letter-spacing: 1px;
}

.nav-left,
.nav-right {
    width: 60px;
    justify-content: center;
}

.icon-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.logo-center {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin: 32px 0 18px 0;
}

.login-logo {
    height: 180px;
    max-width: 360px;
}

.user-type-selector {
    display: flex;
    justify-content: center;
    gap: 30px;
    margin-bottom: 30px;
}

.user-type-selector button {
    padding: 10px 30px;
    border-radius: 20px;
    border: 2px solid #791236;
    background: #fff;
    color: #791236;
    font-weight: 600;
    font-size: 1.1em;
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
}

.user-type-selector button.active,
.user-type-selector button:hover {
    background: #fce9ee;
    color: #791236;
}

.login-form {
    display: flex;
    flex-direction: column;
    align-items: center;
    background: #fff;
    padding: 32px 32px 24px 32px;
    border-radius: 18px;
    box-shadow: 0 2px 16px 0 #0001;
    min-width: 320px;
    gap: 18px;
}

.login-form input {
    width: 240px;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1em;
    margin-bottom: 8px;
}

.login-form button {
    width: 100%;
    background: #791236;
    color: #fff;
    border: none;
    border-radius: 8px;
    padding: 10px 0;
    font-size: 1.1em;
    font-weight: 600;
    cursor: pointer;
    margin-top: 10px;
    transition: background 0.2s;
}

.login-form button:hover {
    background: #a31d4a;
}

.login-message {
    color: #c00;
    margin-top: 8px;
    min-height: 24px;
}

.register-link {
    margin-top: 18px;
    text-align: center;
    font-size: 1em;
    color: #333;
}

.unirme-link {
    color: #791236;
    font-weight: 600;
    margin-left: 6px;
    text-decoration: underline;
    cursor: pointer;
    transition: color 0.2s;
}

.unirme-link:hover {
    color: #a31d4a;
}
</style>
