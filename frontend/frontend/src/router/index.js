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
import PerfilUsuario from '../views/PerfilUsuario.vue';
import FormServicio from '../views/FormServicio.vue';
import Galeria from '../views/Galeria.vue';
import Configuracion from '../views/Configuracion.vue';
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
    { 
        path: '/perfil',
        name: 'perfil', 
        component: PerfilUsuario,
        meta: { requiresAuth: true }
    },
    {
        path: '/dashboard',
        component: Dashboard,
        meta: { requiresAuth: true, proveedorOnly: true },
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
            { 
                path: 'servicios', 
                name: 'dashboard-servicios',
                component: FormServicio
            },
            { 
                path: 'galeria', 
                name: 'dashboard-galeria',
                component: Galeria
            },
            { 
                path: 'configuracion', 
                name: 'dashboard-configuracion',
                component: Configuracion
            },
            { 
                path: 'perfil', 
                name: 'dashboard-perfil',
                component: PerfilUsuario
            },
        ],
    },
    { 
        path: '/:pathMatch(.*)*', 
        name: 'not-found',
        redirect: '/' 
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

// Guard de navegación simplificado
router.beforeEach(async (to, from, next) => {
    const store = useAuthStore();
    
    // Inicializar auth si no está inicializado
    if (!store.isAuthenticated && localStorage.getItem('token')) {
        store.initializeAuth();
    }

    const isAuthenticated = store.isAuthenticated;
    const userType = store.user?.tipo_usuario;

    console.log('🛡️ Navegando a:', to.path, '| Auth:', isAuthenticated, '| Tipo:', userType);

    // Rutas públicas
    const publicRoutes = ['/', '/login', '/registro', '/servicios'];
    const isPublicRoute = publicRoutes.includes(to.path) || to.path.startsWith('/servicio/');

    if (isPublicRoute) {
        // Si ya está autenticado e intenta ir a login/registro, redirigir
        if ((to.path === '/login' || to.path === '/registro') && isAuthenticated) {
            if (userType === 'proveedor') {
                next('/dashboard');
            } else {
                next('/servicios');
            }
            return;
        }
        next();
        return;
    }

    // Rutas que requieren autenticación
    if (!isAuthenticated) {
        next('/login');
        return;
    }

    // Rutas exclusivas de proveedor
    if (to.meta.proveedorOnly && userType !== 'proveedor') {
        next('/servicios');
        return;
    }

    // Verificar emprendimiento para proveedores
    if (to.path.startsWith('/dashboard') && to.path !== '/dashboard/emprendimiento' && userType === 'proveedor') {
        try {
            const response = await axios.get(
                `http://localhost:4000/api/emprendimientos/usuario/${store.user.id_usuario}`,
                {
                    headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                }
            );

            const tieneEmprendimiento = response.data.tieneEmprendimiento || response.data.emprendimiento;

            if (!tieneEmprendimiento) {
                next('/dashboard/emprendimiento');
                return;
            }

            if (response.data.emprendimiento) {
                store.setEmprendimiento(response.data.emprendimiento);
            }
        } catch (error) {
            console.error('Error verificando emprendimiento:', error);
            if (error.response?.status === 404) {
                next('/dashboard/emprendimiento');
                return;
            }
        }
    }

    next();
});

export default router;