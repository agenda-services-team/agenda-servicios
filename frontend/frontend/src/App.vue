<!-- src/App.vue - VERSIÓN CORREGIDA -->
<template>
  <div id="app">
    <!-- Navbar global (excepto en auth routes) -->
    <Navbar v-if="showGlobalNavbar" />
    
    <!-- Contenido principal -->
    <main>
      <router-view />
    </main>

    <!-- Footer global (excepto en auth routes) -->
    <Footer v-if="showGlobalFooter" />
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

export default {
  name: "App",
  components: { 
    Navbar, 
    Footer 
  },
  setup() {
    const route = useRoute();

    const isAuthRoute = computed(() => 
      ['/login', '/registro'].includes(route.path)
    );

    const showGlobalNavbar = computed(() => !isAuthRoute.value);
    const showGlobalFooter = computed(() => !isAuthRoute.value);

    return {
      showGlobalNavbar,
      showGlobalFooter
    };
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  width: 100%;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

main {
  flex: 1;
}
</style>