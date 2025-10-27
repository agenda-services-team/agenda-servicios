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
import Footer from './components/Footer.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './store';

export default {
  name: "App",
  components: { Navbar, ClientNavbar, Footer },
  setup() {
    const route = useRoute();
    const store = useAuthStore();

    // Detecta si está en login o registro
    const isAuthRoute = computed(() =>
      route.path === '/login' || route.path === '/registro'
    );

    // Detecta si hay sesión activa
    const isAuthenticated = computed(() => store.isAuthenticated);

    // Detecta si el usuario es cliente (no proveedor)
    const isClient = computed(() => {
      const tipo = localStorage.getItem('tipo_usuario');
      return tipo === 'cliente' || tipo === 'usuario';
    });
    const isCustomLayoutRoute = computed(() =>
      route.path.startsWith('/servicios')
    )


    return { route, isAuthRoute, isAuthenticated, isClient };
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
