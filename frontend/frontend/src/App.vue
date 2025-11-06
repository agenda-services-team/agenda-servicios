<template>
  <div id="app">
    <router-view v-if="$route.path.startsWith('/dashboard')" />

    <template v-else>
      <!-- ✅ Solo muestra Navbar en Home -->
      <Navbar v-if="$route.path === '/'" />
      
      <main :class="mainClasses">
        <router-view />
      </main>
      
      <Footer v-if="!hideFooter" />
    </template>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';
import { computed } from 'vue';
import { useRoute } from 'vue-router';
import { useAuthStore } from './store';

export default {
  name: "App",
  components: { Navbar, Footer },
  setup() {
    const store = useAuthStore();
    const route = useRoute();
    
    const mainClasses = computed(() => ({
      'main-content': !route.path.startsWith('/dashboard'),
      'no-padding': route.path === '/login' || route.path === '/registro'
    }));
    
    const hideFooter = computed(() => {
      return route.path === '/login' || route.path === '/registro';
    });
    
    return { route, mainClasses, hideFooter };
  }
}
</script>