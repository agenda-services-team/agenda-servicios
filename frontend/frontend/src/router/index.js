import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../components/Login.vue';
import Registro from '../components/Registro.vue';
import Dashboard from '../layouts/Dashboard.vue';
import Servicios from '../views/Servicios.vue';
import ServiciosCliente from '../views/ServiciosCliente.vue';
import Inicio from '../views/Inicio.vue';
import Agenda from '../views/Agenda.vue';
import RegistrarEmprendimiento from '../components/RegisterEmpre.vue';
import Galeria from '../views/Galeria.vue';
import Configuracion from '../views/Configuracion.vue';
import { useAuthStore } from '../store';
import axios from 'axios';
//de nuevo alex : 🤡
import DetalleServicio from '../views/DetalleServicio.vue';

// ✅ alex: CREAR ESTE ARCHIVO NUEVO
import ServiciosCatalogo from '../views/ServiciosCatalogo.vue';

// Importaciones de vistas de cliente
import CitasCliente from '../views/CitasCliente.vue';
import PerfilCliente from '../views/PerfilCliente.vue';

const routes = [
    // Rutas públicas
    {
        path: '/',
        name: 'Home',
        component: Home
    },
    {
        path: '/login',
        name: 'Login',
        component: Login
    },
    {
        path: '/registro',
        name: 'Registro',
        component: Registro
    },
    {
        path: '/serviciosCatalogo',  //  mas corta al parecer
        name: 'ServiciosCatalogo',
        component: ServiciosCatalogo,  
    },

    // Rutas de cliente (requieren autenticación)
    {
        path: '/servicios',  // 😈 jamas modificar: propiedad de alex 😡
        name: 'ServiciosCliente',
        component: ServiciosCliente,
        meta: { requiresAuth: true, requiresCliente: true }
    },
    {
        path: '/servicio/:id',
        name: 'DetalleServicio',
        component: DetalleServicio,
        meta: { requiresAuth: true, requiresCliente: true }
    },
    {
        path: '/cliente/mis-citas',
        name: 'CitasCliente',
        component: CitasCliente,
        meta: { requiresAuth: true, requiresCliente: true }
    },
    {
        path: '/cliente/perfil',
        name: 'PerfilCliente',
        component: PerfilCliente,
        meta: { requiresAuth: true, requiresCliente: true }
    },

    // Rutas de proveedor (Dashboard)
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true, requiresProveedor: true },
        children: [
            { path: '', component: Inicio },
            { path: 'agenda', component: Agenda },
            { path: 'emprendimiento', component: RegistrarEmprendimiento },
            { path: 'servicios', component: Servicios },  // ✅ Servicios del proveedor
            { path: 'galeria', component: Galeria },
            { path: 'configuracion', component: Configuracion }
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'router-link-active',
    linkExactActiveClass: 'router-link-exact-active',
});

router.beforeEach(async (to, from, next) => {
    const store = useAuthStore();
    const isAuthenticated = store.isAuthenticated;
    const tipoUsuario = store.user?.tipo_usuario;

    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
        return;
    }

    if (to.meta.requiresProveedor && tipoUsuario === 'cliente') {
        next('/mis-servicios');  // ✅ Redirige a la ruta correcta
        return;
    }

    if (to.meta.requiresCliente && tipoUsuario === 'proveedor') {
        next('/dashboard');
        return;
    }

    if (to.path.startsWith('/dashboard') && to.path !== '/dashboard/emprendimiento' && isAuthenticated && tipoUsuario === 'proveedor') {
        try {
            const id_usuario = localStorage.getItem('id_usuario');
            const response = await axios.get(`http://localhost:4000/api/emprendimientos/usuario/${id_usuario}`);
            const tieneEmprendimiento = response.data.tieneEmprendimiento;

            if (!tieneEmprendimiento) {
                next('/dashboard/emprendimiento');
                return;
            }
        } catch (error) {
            console.error('Error al verificar emprendimiento:', error);
            next('/dashboard/emprendimiento');
            return;
        }
    }

    next();
});

export default router;