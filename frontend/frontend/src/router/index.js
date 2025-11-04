import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from '../store';

// Lazy loading para mejor performance
const Home = () => import('../views/Home.vue');
const Login = () => import('../components/Login.vue');
const Registro = () => import('../components/Registro.vue');
const Servicios = () => import('../views/Servicios.vue');
const DetalleServicio = () => import('../views/DetalleServicio.vue');
const Dashboard = () => import('../layouts/Dashboard.vue');
const ClientLayout = () => import('../layouts/ClientLayout.vue');

// Dashboard components
const Inicio = () => import('../views/Inicio.vue');
const FormEmprendimiento = () => import('../views/FormEmprendimiento.vue');
const FormServicio = () => import('../views/FormServicio.vue');
const Agenda = () => import('../views/Agenda.vue');
const Galeria = () => import('../views/Galeria.vue');
const Configuracion = () => import('../views/Configuracion.vue');
const PerfilUsuario = () => import('../views/PerfilUsuario.vue');
const RegisterEmpre = () => import('../components/RegisterEmpre.vue');

// Client components
const MisCitas = () => import('../views/MisCitas.vue');

// Meta fields constants
const ROUTE_META = {
  PUBLIC: { requiresAuth: false, public: true },
  GUEST_ONLY: { requiresAuth: false, guestOnly: true },
  AUTH_REQUIRED: { requiresAuth: true },
  PROVEEDOR_ONLY: { requiresAuth: true, requiresProveedor: true },
  CLIENTE_ONLY: { requiresAuth: true, requiresCliente: true }
};

const routes = [
  // ==================== RUTAS PÚBLICAS ====================
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: ROUTE_META.PUBLIC
  },
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: ROUTE_META.GUEST_ONLY
  },
  {
    path: '/registro',
    name: 'Registro',
    component: Registro,
    meta: ROUTE_META.GUEST_ONLY
  },
  {
    path: '/servicios',
    name: 'Servicios',
    component: Servicios,
    meta: ROUTE_META.PUBLIC
  },
  {
    path: '/servicio/:id',
    name: 'DetalleServicio',
    component: DetalleServicio,
    meta: ROUTE_META.PUBLIC,
    props: true // Pasa los params como props
  },

  // ==================== RUTAS DEL PROVEEDOR ====================
  {
    path: '/dashboard',
    component: Dashboard,
    meta: ROUTE_META.PROVEEDOR_ONLY,
    redirect: { name: 'DashboardInicio' },
    children: [
      {
        path: '',
        name: 'DashboardInicio',
        component: Inicio,
        meta: { title: 'Inicio' }
      },
      {
        path: 'emprendimiento',
        name: 'RegisterEmprendimiento',
        component: RegisterEmpre,
        meta: { title: 'Registrar Emprendimiento' }
      },
      {
        path: 'emprendimiento/editar',
        name: 'FormEmprendimiento',
        component: FormEmprendimiento,
        meta: { title: 'Editar Emprendimiento' }
      },
      {
        path: 'servicio',
        name: 'FormServicio',
        component: () => import('../views/FormServicio.vue'),
        meta: { title: 'Gestionar Servicios' }
      },
      // Alias para servicios (ambas rutas funcionan)
      {
        path: 'servicios',
        redirect: '/dashboard/servicio'
      },
      {
        path: 'agenda',
        name: 'Agenda',
        component: Agenda,
        meta: { title: 'Agenda' }
      },
      {
        path: 'galeria',
        name: 'Galeria',
        component: Galeria,
        meta: { title: 'Galería' }
      },
      {
        path: 'configuracion',
        name: 'Configuracion',
        component: Configuracion,
        meta: { title: 'Configuración' }
      },
      {
        path: 'perfil',
        name: 'PerfilUsuario',
        component: PerfilUsuario,
        meta: { title: 'Perfil' }
      }
    ]
  },

  // ==================== RUTAS DEL CLIENTE ====================
  {
    path: '/cliente',
    component: ClientLayout,
    meta: ROUTE_META.CLIENTE_ONLY,
    redirect: { name: 'MisCitas' },
    children: [
      {
        path: 'mis-citas',
        name: 'MisCitas',
        component: MisCitas,
        meta: { title: 'Mis Citas' }
      },
      {
        path: 'perfil',
        name: 'PerfilCliente',
        component: PerfilUsuario,
        meta: { title: 'Perfil' }
      }
    ]
  },

  // ==================== RUTA 404 ====================
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    redirect: '/'
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  // Mejorar experiencia de navegación
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition;
    } else {
      return { top: 0, behavior: 'smooth' };
    }
  }
});

// ==================== GUARD DE NAVEGACIÓN MEJORADO ====================
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  
  // Inicializar autenticación si hay token
  if (!authStore.isInitialized && localStorage.getItem('token')) {
    await authStore.initializeAuth();
  }

  const isAuthenticated = authStore.isAuthenticated;
  const userType = authStore.user?.tipo_usuario;

  console.log('🛡️ Navegación:', {
    to: to.path,
    authenticated: isAuthenticated,
    userType: userType,
    meta: to.meta
  });

  // ========== RUTAS PÚBLICAS ==========
  if (to.meta.public) {
    return next();
  }

  // ========== RUTAS SOLO PARA INVITADOS ==========
  if (to.meta.guestOnly) {
    if (isAuthenticated) {
      // Redirigir según el tipo de usuario
      const redirectPath = userType === 'proveedor' ? '/dashboard' : '/cliente/mis-citas';
      console.log(`✅ Usuario autenticado, redirigiendo a: ${redirectPath}`);
      return next(redirectPath);
    }
    return next();
  }

  // ========== RUTAS QUE REQUIEREN AUTENTICACIÓN ==========
  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      console.log('⚠️ No autenticado, redirigiendo a login');
      return next({
        name: 'Login',
        query: { redirect: to.fullPath }
      });
    }

    // ========== VERIFICACIÓN DE ROLES ==========
    
    // Ruta para proveedores pero usuario es cliente
    if (to.meta.requiresProveedor && userType !== 'proveedor') {
      console.log('🚫 Acceso denegado: se requiere ser proveedor');
      return next('/cliente/mis-citas');
    }

    // Ruta para clientes pero usuario es proveedor
    if (to.meta.requiresCliente && userType !== 'cliente') {
      console.log('🚫 Acceso denegado: se requiere ser cliente');
      return next('/dashboard');
    }

    console.log('✅ Acceso permitido');
    return next();
  }

  
  next();
});

// Opcional: Guard afterEach para analytics o cambios de título
router.afterEach((to) => {
  // Cambiar título de la página
  const title = to.meta.title || 'Oaxaca Glow';
  document.title = `${title} - Oaxaca Glow`;
  
  // Analytics tracking
  console.log('📍 Navegación completada:', to.path);
});

export default router;