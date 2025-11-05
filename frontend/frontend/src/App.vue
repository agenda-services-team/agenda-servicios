<template>
  <div id="app">
    <!-- Renderiza directamente el router-view para rutas de dashboard -->
    <router-view v-if="$route.path.startsWith('/dashboard')" />

    <!-- Para otras rutas, muestra Navbar, contenido y Footer -->
    <template v-else>
      <Navbar v-if="$route.path !== '/login' && $route.path !== '/registro'" />
      <main
        :class="{ 'main-content': !$route.path.startsWith('/dashboard'), 'no-padding': $route.path === '/login' || $route.path === '/registro' }">
        <router-view />
      </main>
      <Footer v-if="$route.path !== '/login' && $route.path !== '/registro'" />
    </template>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router'; // Importar useRoute
import { useAuthStore } from './store';

export default {
  name: "App",
  components: { Navbar, Footer },
  setup() {
    const store = useAuthStore();
    const route = useRoute();
    const isAuth = computed(() => store.isAuthenticated);
    const logout = () => {
      store.logout();
    };
    return { isAuth, route };
  }
}
</script>

<style>
#app {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
  padding-top: 80px;
  margin: 0 auto;
}

.no-padding {
  padding-top: 0;
}
</style>