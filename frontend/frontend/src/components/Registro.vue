<template>
    <div class="login-page">
        <!-- Navbar igual que login -->
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

        <!-- Logo debajo del navbar -->
        <div class="logo-center">
            <img src="/src/assets/logo.png" alt="Logo" class="login-logo" />
        </div>

        <!-- Formulario de registro -->
        <form class="login-form card p-4 shadow-sm" style="max-width: 370px; width: 100%; margin: 0 auto;"
            @submit.prevent="registrar" novalidate>
            <div class="mb-3 w-100">
                <input v-model="nombre" type="text" class="form-control" placeholder="Nombre" required />
            </div>
            <div class="mb-3 w-100">
                <input v-model="correo" type="email" class="form-control" placeholder="Correo electrónico" required />
            </div>
            <div class="mb-3 w-100 password-wrapper">
                <input :type="mostrarContrasena ? 'text' : 'password'" v-model="contrasena" class="form-control"
                    placeholder="Contraseña" :class="{ 'is-invalid': contrasenaError }" required />
                <button type="button" class="toggle-pass-btn" @click="mostrarContrasena = !mostrarContrasena"
                    :aria-label="mostrarContrasena ? 'Ocultar contraseña' : 'Mostrar contraseña'">
                    <svg v-if="mostrarContrasena" xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                        viewBox="0 0 24 24">
                        <path fill="#791236"
                            d="M12 5c-7 0-10 7-10 7s3 7 10 7 10-7 10-7-3-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10z" />
                    </svg>
                    <svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24">
                        <path fill="#791236"
                            d="M12 5c-7 0-10 7-10 7s3 7 10 7c1.7 0 3.2-.3 4.6-.9l2.1 2.1 1.4-1.4-16-16-1.4 1.4 2.2 2.2C3.4 9.6 2 12 2 12s3 7 10 7c2 0 3.8-.5 5.4-1.4l1.6 1.6 1.4-1.4-16-16-1.4 1.4L5.6 7C7.2 6.4 9.5 6 12 6c.6 0 1.1 0 1.6.1L12 5z" />
                    </svg>
                </button>
            </div>
            <div v-if="contrasenaError" class="invalid-feedback d-block">Las contraseñas no coinciden</div>
            <div class="mb-3 w-100">
                <input v-model="confirmarContrasena" :type="mostrarContrasena ? 'text' : 'password'"
                    class="form-control" placeholder="Confirmar contraseña" :class="{ 'is-invalid': contrasenaError }"
                    required />
            </div>
            <div class="mb-3 w-100">
                <input v-model="telefono" type="telefono" class="form-control" placeholder="telefono" required />
            </div>
            <div class="mb-3 w-100">
                <label for="tipoUsuario" class="form-label">Tipo de usuario:</label>
                <select v-model="tipoUsuario" id="tipoUsuario" class="form-select" required>
                    <option value="cliente">Cliente</option>
                    <option value="proveedor">Proveedor</option>
                </select>
            </div>
            <button type="submit" class="btn btn-primary w-100">Registrarse</button>
            <p class="login-message mt-2">{{ mensaje }}</p>
            <div class="register-link">
                ¿Ya tienes una cuenta?
                <router-link to="/login" class="unirme-link">Iniciar sesión</router-link>
            </div>
        </form>
        <Footer />
    </div>
</template>

<script>
import axios from 'axios';
import Footer from './Footer.vue';
import Swal from 'sweetalert2';
export default {
    components: { Footer },
    data() {
        return {
            nombre: '',
            correo: '',
            contrasena: '',
            confirmarContrasena: '',
            mostrarContrasena: false,
            telefono: '',
            tipoUsuario: 'cliente',
            mensaje: '',
            contrasenaError: false
        }
    },
    methods: {
        async registrar() {
            this.contrasenaError = false;
            if (this.contrasena !== this.confirmarContrasena) {
                this.contrasenaError = true;
                this.mensaje = 'Las contraseñas no coinciden';
                return;
            }
            try {
                await axios.post('http://localhost:4000/api/usuarios/registro', {
                    nombre: this.nombre,
                    correo: this.correo,
                    contrasena: this.contrasena,
                    telefono: this.telefono,
                    tipo_usuario: this.tipoUsuario
                });

                await Swal.fire({
                    icon: 'success',
                    title: '¡Registro exitoso!',
                    text: 'Tu cuenta ha sido creada correctamente. Ahora puedes iniciar sesión.',
                    confirmButtonText: 'Continuar',
                    confirmButtonColor: '#791236'
                });

                this.$router.push('/login');
            } catch (err) {
                Swal.fire({
                    icon: 'error',
                    title: 'Error al registrar',
                    text: err.response?.data || 'Ocurrió un error durante el registro. Por favor, intenta nuevamente.',
                    confirmButtonColor: '#791236'
                });
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

.login-form {
    max-width: 370px;
    width: 100%;
    margin: 0 auto;
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

.login-form button[type="submit"] {
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

.login-form button[type="submit"]:hover {
    background: #a31d4a;
}

.login-message {
    color: #c00;
    margin-top: 8px;
    min-height: 24px;
}

.password-wrapper {
    position: relative;
    width: 100%;
}

.password-wrapper input {
    padding-right: 40px;
    /* espacio para el icono */
}

.toggle-pass-btn {
    position: absolute;
    right: 10px;
    top: 50%;
    transform: translateY(-50%);
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.unirme-link {
    color: #791236;
    font-weight: 600;
    margin-left: 6px;
    text-decoration: underline;
    cursor: pointer;
    transition: color 0.2s;
}
</style>
