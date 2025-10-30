import { defineStore } from 'pinia';
import axios from 'axios';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        user: null,
        emprendimiento: null
    }),

    getters: {
        isProveedor: (state) => state.user?.tipo_usuario === 'proveedor',
        isCliente: (state) => state.user?.tipo_usuario === 'cliente',
        userName: (state) => state.user?.nombre || '',
        userId: (state) => state.user?.id_usuario || null,
        userType: (state) => state.user?.tipo_usuario || null
    },

    actions: {
        // Inicializar auth desde localStorage
        initializeAuth() {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');

            if (token && userStr) {
                try {
                    const user = JSON.parse(userStr);
                    this.isAuthenticated = true;
                    this.user = user;
                    console.log('✅ Auth inicializado:', user);
                } catch (error) {
                    console.error('❌ Error parseando user:', error);
                    this.logout();
                }
            }
        },

        // Login
        login(token, userData) {
            console.log('📝 Guardando login:', { token, userData });

            // Guardar en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            // Actualizar estado
            this.isAuthenticated = true;
            this.user = userData;

            console.log('✅ Login guardado en store y localStorage');
        },

        // Logout
        logout() {
            console.log('🚪 Cerrando sesión...');

            // Limpiar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            // Limpiar estado
            this.isAuthenticated = false;
            this.user = null;
            this.emprendimiento = null;

            console.log('✅ Sesión cerrada');
        },

        // Guardar emprendimiento
        setEmprendimiento(emprendimiento) {
            this.emprendimiento = emprendimiento;
            localStorage.setItem('emprendimiento', JSON.stringify(emprendimiento));
        },

        // Obtener perfil del usuario
        async fetchUserProfile() {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(
                    `http://localhost:4000/api/usuarios/perfil/${this.user.id_usuario}`,
                    {
                        headers: { 'Authorization': `Bearer ${token}` }
                    }
                );
                return response.data;
            } catch (error) {
                console.error('Error al obtener perfil:', error);
                throw error;
            }
        }
    }
});
