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

// Importaciones de vistas de cliente
import CitasCliente from '../views/CitasCliente.vue'; // ✅ CORREGIDO
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

    // Rutas de cliente (requieren autenticación)
    {
        path: '/servicios',
        name: 'Servicios',
        component: ServiciosCliente,
        meta: { requiresAuth: true, requiresCliente: true } // ✅ AGREGADO
    },
    {
        path: '/cliente/mis-citas', // ✅ CAMBIADO para consistencia
        name: 'CitasCliente',
        component: CitasCliente,
        meta: { requiresAuth: true, requiresCliente: true } // ✅ AGREGADO
    },
    {
        path: '/cliente/perfil',
        name: 'PerfilCliente',
        component: PerfilCliente,
        meta: { requiresAuth: true, requiresCliente: true } // ✅ AGREGADO
    },

    // Rutas de proveedor (Dashboard)
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: Dashboard,
        meta: { requiresAuth: true, requiresProveedor: true }, // ✅ AGREGADO
        children: [
            { path: '', component: Inicio },
            { path: 'agenda', component: Agenda },
            { path: 'emprendimiento', component: RegistrarEmprendimiento }, // para registrar emprendimiento
            { path: 'servicios', component: Servicios }, // para mostrar los servicios
            { path: 'galeria', component: Galeria },//una galeria de imagenes de los trabajos del proveedor
            { path: 'configuracion', component: Configuracion } // configuración del perfil del proveedor
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'router-link-active',
    linkExactActiveClass: 'router-link-exact-active',
});

// ✅ GUARD MEJORADO
router.beforeEach(async (to, from, next) => {
    const store = useAuthStore();
    const isAuthenticated = store.isAuthenticated;
    const tipoUsuario = store.user?.tipo_usuario;

    // 1. Verificar autenticación para rutas protegidas
    if (to.meta.requiresAuth && !isAuthenticated) {
        next('/login');
        return;
    }

    // 2. Verificar que clientes no accedan a dashboard
    if (to.meta.requiresProveedor && tipoUsuario === 'cliente') {
        next('/servicios');
        return;
    }

    // 3. Verificar que proveedores no accedan a rutas de cliente
    if (to.meta.requiresCliente && tipoUsuario === 'proveedor') {
        next('/dashboard');
        return;
    }

    // 4. Verificar emprendimiento solo para proveedores en dashboard
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