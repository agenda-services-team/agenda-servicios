import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../components/Login.vue';
import Registro from '../components/Registro.vue';
import Dashboard from '../layouts/Dashboard.vue';
import Servicios from '../views/Servicios.vue';
import Inicio from '../views/Inicio.vue';
import Agenda from '../views/Agenda.vue';
import RegistrarEmprendimiento from '../components/RegisterEmpre.vue';
import DetalleServicio from '../views/DetalleServicio.vue';
import { useAuthStore } from '../store';
import axios from 'axios';

const routes = [
    { 
        path: '/', 
        name: 'home',
        component: Home 
    },
    { 
        path: '/login', 
        name: 'login',
        component: Login 
    },
    { 
        path: '/registro', 
        name: 'registro',
        component: Registro 
    },
    { 
        path: '/servicios', 
        name: 'servicios',
        component: Servicios 
    },
    { 
        path: '/servicio/:id',
        name: 'servicio-detalle',
        component: DetalleServicio 
    },
    // 🆕 RUTAS TEMPORALES PARA EVITAR ERRORES
    { 
        path: '/mis-citas',
        name: 'mis-citas',
        component: Servicios, // ✅ Usar componente existente temporalmente
        meta: { title: 'Mis Citas - Próximamente' }
    },
    { 
        path: '/perfil',
        name: 'perfil', 
        component: Servicios, // ✅ Usar componente existente temporalmente
        meta: { title: 'Mi Perfil - Próximamente' }
    },
    {
        path: '/dashboard',
        component: Dashboard,
        children: [
            { 
                path: '', 
                name: 'dashboard-inicio',
                component: Inicio 
            },
            { 
                path: 'agenda', 
                name: 'dashboard-agenda',
                component: Agenda 
            },
            { 
                path: 'emprendimiento', 
                name: 'dashboard-emprendimiento',
                component: RegistrarEmprendimiento 
            },
        ],
    },
    // 🆕 RUTA DE FALLBACK PARA 404
    { 
        path: '/:pathMatch(.*)*', 
        name: 'not-found',
        redirect: '/' 
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'router-link-active',
    linkExactActiveClass: 'router-link-exact-active',
});

// Guardia de navegación MEJORADO
router.beforeEach(async (to, from, next) => {
    const store = useAuthStore();
    const isAuthenticated = store.isAuthenticated;

    // 🆕 Actualizar título de la página si está definido en meta
    if (to.meta?.title) {
        document.title = to.meta.title;
    }

    // Permitir acceso a rutas públicas sin autenticación
    const publicPages = ['/', '/login', '/registro', '/servicios', '/servicio/:id'];
    const isPublicPage = publicPages.some(page => {
        if (page.includes(':')) {
            // Para rutas con parámetros como /servicio/:id
            const basePath = page.split('/:')[0];
            return to.path.startsWith(basePath);
        }
        return to.path === page;
    });

    if (isPublicPage) {
        next();
        return;
    }

    // Proteger rutas que requieren autenticación
    if (!isAuthenticated) {
        next('/login');
        return;
    }

    // 🆕 Si está autenticado y va a login/registro, redirigir a servicios
    if ((to.path === '/login' || to.path === '/registro') && isAuthenticated) {
        next('/servicios');
        return;
    }

    // Verificar emprendimiento para proveedores en dashboard
    if (to.path.startsWith('/dashboard') && to.path !== '/dashboard/emprendimiento') {
        try {
            const id_usuario = store.userId || localStorage.getItem('id_usuario');
            
            if (!id_usuario) {
                next('/dashboard/emprendimiento');
                return;
            }

            const response = await axios.get(`http://localhost:4000/api/emprendimientos/usuario/${id_usuario}`);
            const tieneEmprendimiento = response.data.tieneEmprendimiento;

            if (!tieneEmprendimiento) {
                next('/dashboard/emprendimiento');
                return;
            }
        } catch (error) {
            console.error('Error al verificar emprendimiento:', error);
            // En caso de error, redirigir al registro de emprendimiento
            next('/dashboard/emprendimiento');
            return;
        }
    }

    next();
});

export default router;