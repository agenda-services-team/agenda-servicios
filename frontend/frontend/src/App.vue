<template>
  <div id="app">
    <!-- Navbar y Footer solo si no estamos en /login o /registro -->
    <Navbar v-if="$route.path !== '/login' && $route.path !== '/registro' && $route.path !== '/dashboard'" />
    <main class="main-content"
      :class="{ 'no-padding': $route.path === '/login' || $route.path === '/registro' || $route.path === '/dashboard' }">
      <router-view />
    </main>
    <Footer v-if="$route.path !== '/login' && $route.path !== '/registro' && $route.path !== '/dashboard'" />
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import { computed } from 'vue';
import { useAuthStore } from './store';

export default {
  name: "App",
  components: { Navbar, Footer },
  setup() {
    const store = useAuthStore();
    const isAuth = computed(() => store.isAuthenticated);
    const logout = () => {
      store.logout();
    };
    return { isAuth, logout };
  }
}
</script>

<style>
/* Estilos globales para toda la plataforma*/
#app {
  font-family: Arial, sans-serif;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  /* Toda la altura de la ventana */
}

/* Se agrega el  padding al main para qeu el contenido no quede debajo del headre */
.main-content {
  flex: 1;
  padding-top: 80px;
  margin: 0 auto;
}

.main-content.no-padding {
  padding-top: 0;
}
</style>
