import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store';

// Importar vistas
import Home from '../views/Home.vue';
import Login from '../components/Login.vue';
import Registro from '../components/Registro.vue';
import Servicios from '../views/Servicios.vue';
import DetalleServicio from '../views/DetalleServicio.vue';
import Dashboard from '../layouts/Dashboard.vue';
import ClientLayout from '../layouts/ClientLayout.vue';

// Vistas del Dashboard Proveedor
import Inicio from '../views/Inicio.vue';
import FormEmprendimiento from '../views/FormEmprendimiento.vue';
import FormServicio from '../views/FormServicio.vue';
import Agenda from '../views/Agenda.vue';
import Galeria from '../views/Galeria.vue';
import Configuracion from '../views/Configuracion.vue';
import PerfilUsuario from '../views/PerfilUsuario.vue';
import RegisterEmpre from '../components/RegisterEmpre.vue';

// Vistas del Cliente
import MisCitas from '../views/MisCitas.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: { requiresAuth: false, public: true }
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/registro',
    name: 'Registro',
    component: Registro,
    meta: { requiresAuth: false, guestOnly: true }
  },
  {
    path: '/servicios',
    name: 'Servicios',
    component: Servicios,
    meta: { requiresAuth: false, public: true }
  },
  {
    path: '/servicio/:id',
    name: 'DetalleServicio',
    component: DetalleServicio,
    meta: { requiresAuth: false, public: true }
  },

  // ==================== RUTAS DEL PROVEEDOR ====================
  {
    path: '/dashboard',
    component: Dashboard,
    meta: { requiresAuth: true, requiresProveedor: true },
    children: [
      {
        path: '',
        name: 'DashboardInicio',
        component: Inicio
      },
      {
        path: 'emprendimiento',
        name: 'RegisterEmprendimiento',
        component: RegisterEmpre
      },
      {
        path: 'emprendimiento/editar',
        name: 'FormEmprendimiento',
        component: FormEmprendimiento
      },
      {
        path: 'servicio',
        name: 'FormServicio',
        component: FormServicio
      },
      {
        path: 'agenda',
        name: 'Agenda',
        component: Agenda
      },
      {
        path: 'galeria',
        name: 'Galeria',
        component: Galeria
      },
      {
        path: 'configuracion',
        name: 'Configuracion',
        component: Configuracion
      },
      {
        path: 'perfil',
        name: 'PerfilUsuario',
        component: PerfilUsuario
      }
    ]
  },

  // ==================== RUTAS DEL CLIENTE ====================
  {
    path: '/cliente',
    component: ClientLayout,
    meta: { requiresAuth: true, requiresCliente: true },
    children: [
      {
        path: 'mis-citas',
        name: 'MisCitas',
        component: MisCitas
      },
      {
        path: 'perfil',
        name: 'PerfilCliente',
        component: PerfilUsuario
      }
    ]
  },

  // ==================== RUTA 404 ====================
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

// ==================== GUARD DE NAVEGACIÓN GLOBAL ====================
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore();
  
  // Inicializar autenticación si no está cargada
  if (!authStore.isAuthenticated && localStorage.getItem('token')) {
    authStore.initializeAuth();
  }

  const isAuthenticated = authStore.isAuthenticated;
  const userType = authStore.user?.tipo_usuario;

  console.log('🛡️ Navegando a:', to.path, '| Auth:', isAuthenticated, '| Tipo:', userType);

  // ========== RUTAS PÚBLICAS ==========
  if (to.meta.public) {
    return next();
  }

  // ========== RUTAS SOLO PARA INVITADOS (login/registro) ==========
  if (to.meta.guestOnly) {
    if (isAuthenticated) {
      // Si ya está autenticado, redirigir a su dashboard
      if (userType === 'proveedor') {
        return next('/dashboard');
      } else if (userType === 'cliente') {
        return next('/cliente/mis-citas');
      }
    }
    return next();
  }

  // ========== RUTAS QUE REQUIEREN AUTENTICACIÓN ==========
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      console.log('⚠️ No autenticado, redirigiendo a /login');
      return next({
        path: '/login',
        query: { redirect: to.fullPath }
      });
    }

    // ========== VERIFICAR TIPO DE USUARIO ==========
    
    // Rutas solo para proveedores
    if (to.meta.requiresProveedor && userType !== 'proveedor') {
      console.log('⚠️ Acceso denegado: requiere ser proveedor');
      return next('/servicios');
    }

    // Rutas solo para clientes
    if (to.meta.requiresCliente && userType !== 'cliente') {
      console.log('⚠️ Acceso denegado: requiere ser cliente');
      return next('/dashboard');
    }

    return next();
  }

  // Por defecto, permitir navegación
  next();
});

export default router;