import { createRouter, createWebHistory } from 'vue-router';

import Home from '../views/Home.vue';
import Login from '../components/Login.vue';
import Registro from '../components/Registro.vue';
import Dashboard from '../views/Dashboard.vue';
import Servicios from '../components/Servicios.vue';

const routes = [
    {
        path: '/',
        component: Home
    },
    { path: '/login', component: Login },
    { path: '/registro', component: Registro },
    { path: '/dashboard', component: Dashboard },
    { path: '/servicios', component: Servicios },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
