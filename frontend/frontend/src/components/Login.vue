<template>
    <div class="login-page">
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
                <button class="icon-btn" @click="mostrarAyuda" aria-label="Ayuda">
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#791236" stroke-width="2.2"
                        stroke-linecap="round" stroke-linejoin="round">
                        <circle cx="12" cy="12" r="10" />
                        <path d="M9.09 9a3 3 0 1 1 5.83 1c0 2-3 3-3 3" />
                        <line x1="12" y1="17" x2="12" y2="17" />
                    </svg>
                </button>
            </div>
        </nav>

        <div class="logo-center">
            <img src="/src/assets/logo.png" alt="Logo" class="login-logo" />
        </div>

        <form class="login-form" @submit.prevent="login">
            <div class="input-group">
                <input 
                    v-model="correo" 
                    type="email" 
                    placeholder="Correo electrónico" 
                    required 
                    :disabled="loading"
                />
            </div>
            
            <div class="input-group">
                <input 
                    v-model="contrasena" 
                    type="password" 
                    placeholder="Contraseña" 
                    required 
                    :disabled="loading"
                />
            </div>
            
            <button type="submit" :disabled="loading">
                <span v-if="loading" class="loading-spinner"></span>
                {{ loading ? 'Ingresando...' : 'Ingresar' }}
            </button>
            
            <p v-if="mensaje" class="login-message error">
                {{ mensaje }}
            </p>
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
import { useAuthStore } from '../store';

export default {
    components: { Footer },
    data() {
        return {
            correo: '',
            contrasena: '',
            mensaje: '',
            loading: false
        }
    },
    setup() {
        const authStore = useAuthStore();
        return { authStore };
    },
    methods: {
        async login() {
            this.loading = true;
            this.mensaje = '';
            
            try {
                console.log('🔐 Intentando login con:', this.correo);

                const response = await axios.post('http://localhost:4000/api/usuarios/login', {
                    correo: this.correo,
                    contrasena: this.contrasena
                });

                console.log('📦 Respuesta del servidor:', response.data);

                const { token, usuario } = response.data;

                if (!token || !usuario) {
                    throw new Error('Respuesta del servidor incompleta');
                }

                // Guardar en el store
                this.authStore.login(token, usuario);

                console.log('✅ Login exitoso, tipo de usuario:', usuario.tipo_usuario);

                // Redirección según tipo de usuario
                if (usuario.tipo_usuario === 'proveedor') {
                    console.log('🚀 Redirigiendo a dashboard de proveedor...');
                    this.$router.push('/dashboard');
                } else if (usuario.tipo_usuario === 'cliente') {
                    console.log('🛍️ Redirigiendo a servicios...');
                    this.$router.push('/servicios');
                } else {
                    console.warn('⚠️ Tipo de usuario desconocido:', usuario.tipo_usuario);
                    this.$router.push('/servicios');
                }

            } catch (error) {
                console.error('❌ Error en login:', error);
                
                if (error.response?.status === 401) {
                    this.mensaje = 'Correo o contraseña incorrectos';
                } else if (error.response?.status === 500) {
                    this.mensaje = 'Error del servidor. Intente más tarde.';
                } else if (error.code === 'ERR_NETWORK') {
                    this.mensaje = 'Error de conexión. Verifique su internet.';
                } else {
                    this.mensaje = error.response?.data?.mensaje || 'Error al iniciar sesión';
                }
            } finally {
                this.loading = false;
            }
        },
        
        mostrarAyuda() {
            alert('Si tienes problemas para iniciar sesión, verifica:\n\n• Que tu correo esté escrito correctamente\n• Que estés usando la contraseña correcta\n• Si olvidaste tu contraseña, contacta con soporte');
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

.nav-left, .nav-center, .nav-right {
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

.nav-left, .nav-right {
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
    transition: opacity 0.2s;
}

.icon-btn:hover {
    opacity: 0.7;
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

.input-group {
    display: flex;
    flex-direction: column;
    width: 240px;
}

.login-form input {
    width: 100%;
    padding: 10px 14px;
    border-radius: 8px;
    border: 1px solid #ccc;
    font-size: 1em;
    transition: border-color 0.2s;
    box-sizing: border-box;
}

.login-form input:focus {
    outline: none;
    border-color: #791236;
}

.login-form input:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
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
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
}

.login-form button:hover:not(:disabled) {
    background: #a31d4a;
    transform: translateY(-1px);
}

.login-form button:disabled {
    background: #ccc;
    cursor: not-allowed;
    transform: none;
}

.loading-spinner {
    width: 16px;
    height: 16px;
    border: 2px solid transparent;
    border-top: 2px solid #fff;
    border-radius: 50%;
    animation: spin 1s linear infinite;
}

@keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
}

.login-message {
    margin-top: 8px;
    min-height: 24px;
    text-align: center;
    font-size: 0.95em;
}

.login-message.error {
    color: #c00;
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