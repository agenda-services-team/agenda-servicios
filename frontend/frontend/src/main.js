import { createApp } from 'vue';
import { createPinia } from 'pinia';
import App from './App.vue';
import router from './router';
import './style.css';
import { useAuthStore } from './store';

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

// ⚠️ IMPORTANTE: Inicializar autenticación ANTES de montar la app
const authStore = useAuthStore();
authStore.initializeAuth();

app.mount('#app');
