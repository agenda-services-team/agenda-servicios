<!-- src/App.vue -->
<template>
  <div id="app">
    <!-- Layout del dashboard (proveedores) -->
    <router-view v-if="$route.path.startsWith('/dashboard')" />

    <!-- Resto de páginas -->
    <template v-else>
      <!-- Navbar: cambia según autenticación -->
      <Navbar v-if="!isAuthenticated && !isCustomLayoutRoute" />
<ClientNavbar v-else-if="isClient && !isCustomLayoutRoute" />


      <!-- Contenido -->
      <main :class="{ 'no-padding': isAuthRoute }">
        <router-view />
      </main>

      <!-- Footer solo en páginas públicas o de cliente -->
      <Footer v-if="!isAuthRoute" />
    </template>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import ClientNavbar from './components/ClientNavbar.vue';
import { useAuthStore } from './store';
import { computed } from 'vue';

export default {
  name: "App",
  components: { Navbar, ClientNavbar },
  setup() {
    const authStore = useAuthStore();

    const isProveedor = computed(() => authStore.isProveedor);
    const isClient = computed(() => authStore.isCliente);
    const isCustomLayoutRoute = computed(() => {
      const customRoutes = ['/login', '/registro', '/', '/servicios'];
      return customRoutes.includes(window.location.pathname) || 
             window.location.pathname.startsWith('/servicio/');
    });

    return {
      authStore,
      isProveedor,
      isClient,
      isCustomLayoutRoute
    };
  }
};
</script>

<style>
#app {
  width: 100%;
  min-height: 100vh;
  margin: 0;
  padding: 0;
  text-align: left;
}

.no-padding {
  padding-top: 0;
}
</style>
