<!-- src/App.vue - VERSIÓN SIMPLIFICADA -->
<template>
  <div id="app">
    <!-- Dashboard usa su propio layout -->
    <router-view v-if="$route.path.startsWith('/dashboard')" />

    <!-- Para otras rutas, muestra Navbar, contenido y Footer -->
    <template v-else>
      <Navbar v-if="!isAuthRoute" />
      <main :class="{ 'no-padding': isAuthRoute }">
        <router-view />
      </main>
      <Footer v-if="!isAuthRoute" />
    </template>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';

export default {
  name: "App",
  components: { Navbar, Footer },
  setup() {
    const route = useRoute();
    
    const isAuthRoute = computed(() => 
      route.path === '/login' || route.path === '/registro'
    );

    return { 
      route,
      isAuthRoute
    };
  }
}
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