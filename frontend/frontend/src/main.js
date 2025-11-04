import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './style.css';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// Configuración global de la app
app.config.errorHandler = (err, instance, info) => {
  console.error('Error global de Vue:', err, info);
  // Aquí puedes enviar el error a un servicio de tracking
};

app.config.warnHandler = (msg, instance, trace) => {
  console.warn('Advertencia Vue:', msg, trace);
};

// Inicialización optimizada
const initApp = () => {
  try {
    // Importar store dinámicamente para evitar circular dependencies
    const { useAuthStore } = require('./store');
    const authStore = useAuthStore();
    
    // Inicializar auth de forma síncrona (si no es async)
    authStore.initializeAuth();
    
    console.log('🔐 Estado de autenticación:', {
      isAuthenticated: authStore.isAuthenticated,
      userType: authStore.userType,
      userName: authStore.userName
    });
    
    app.mount('#app');
    
  } catch (error) {
    console.error('Error durante la inicialización:', error);
    
    // Montar app incluso con errores para que el usuario pueda interactuar
    app.mount('#app');
    
    // Opcional: mostrar notificación de error
    setTimeout(() => {
      if (typeof app.config.globalProperties.$notify === 'function') {
        app.config.globalProperties.$notify({
          type: 'error',
          title: 'Error de inicialización',
          message: 'Algunas funciones pueden no estar disponibles'
        });
      }
    }, 1000);
  }
};

// Iniciar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}