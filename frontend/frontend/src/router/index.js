import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue';
import Login from '../components/Login.vue';
import Registro from '../components/Registro.vue';
import Dashboard from '../layouts/Dashboard.vue';
import Servicios from '../views/Servicios.vue';
import Inicio from '../views/Inicio.vue';
import Agenda from '../views/Agenda.vue';
import RegistrarEmprendimiento from '../components/RegisterEmpre.vue';
import Galeria from '../views/Galeria.vue';
import Configuracion from '../views/Configuracion.vue';
import { useAuthStore } from '../store';
import axios from 'axios';

const routes = [
    { path: '/', component: Home },
    { path: '/login', component: Login },
    { path: '/registro', component: Registro },
    {
        path: '/dashboard',
        component: Dashboard,
        children: [
            { path: '', component: Inicio },
            { path: 'agenda', component: Agenda },
            { path: 'emprendimiento', component: RegistrarEmprendimiento }, // para registrar emprendimiento
            { path: 'servicios', component: Servicios }, // para mostrar los servicios
            { path: 'galeria', component: Galeria },//una galeria de imagenes de los trabajos del proveedor
            { path: 'configuracion', component: Configuracion } //Para que el usuario pueda configurar su cuenta
        ],
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    linkActiveClass: 'router-link-active',
    linkExactActiveClass: 'router-link-exact-active',
});

// Guardia de navegación
router.beforeEach(async (to, from, next) => {
    const store = useAuthStore();
    const isAuthenticated = store.isAuthenticated;

    // Verificar si el usuario está autenticado para rutas de dashboard
    if (to.path.startsWith('/dashboard') && !isAuthenticated) {
        next('/login');
        return;
    }

    // Verificar si el usuario tiene un emprendimiento registrado
    if (to.path.startsWith('/dashboard') && to.path !== '/dashboard/emprendimiento' && isAuthenticated) {
        try {
            const id_usuario = localStorage.getItem('id_usuario'); // Obtener id_usuario
            const response = await axios.get(`http://localhost:4000/api/emprendimientos/usuario/${id_usuario}`);
            const tieneEmprendimiento = response.data.tieneEmprendimiento; // el backend devuelve esto

            if (!tieneEmprendimiento) {
                next('/dashboard/emprendimiento'); // Redirigir a registrar emprendimiento
                return;
            }
        } catch (error) {
            console.error('Error al verificar emprendimiento:', error);
            next('/dashboard/emprendimiento'); // En caso de error, redirigir a registrar emprendimiento
            return;
        }
    }

    next();
});

export default router;