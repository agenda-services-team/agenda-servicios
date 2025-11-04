import { defineStore } from 'pinia';

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
        userId: (state) => {
            const id = state.user?.id_usuario;
            return id ? parseInt(id, 10) : null;
        },
        userType: (state) => state.user?.tipo_usuario || null
    },

    actions: {
        initializeAuth() {
            const token = localStorage.getItem('token');
            const userStr = localStorage.getItem('user');

            console.log('🔄 Inicializando autenticación...');
            console.log('  Token:', token ? '✅ Presente' : '❌ No encontrado');
            console.log('  User:', userStr ? '✅ Presente' : '❌ No encontrado');

            if (token && userStr) {
                try {
                    const user = JSON.parse(userStr);
                    
                    // Asegurar que id_usuario sea número
                    if (user.id_usuario && typeof user.id_usuario === 'string') {
                        user.id_usuario = parseInt(user.id_usuario, 10);
                    }
                    
                    this.isAuthenticated = true;
                    this.user = user;
                    
                    console.log('✅ Auth inicializado:', {
                        nombre: user.nombre,
                        tipo: user.tipo_usuario,
                        id: user.id_usuario
                    });
                } catch (error) {
                    console.error('❌ Error parseando user:', error);
                    this.logout();
                }
            } else {
                console.log('ℹ️ No hay sesión activa');
                this.logout();
            }
        },

        login(token, userData) {
            console.log('📝 Guardando login:', { token: '***', userData });

            // Asegurar que id_usuario sea número
            if (userData.id_usuario && typeof userData.id_usuario === 'string') {
                userData.id_usuario = parseInt(userData.id_usuario, 10);
            }

            // Guardar en localStorage
            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            // Actualizar estado
            this.isAuthenticated = true;
            this.user = userData;

            console.log('✅ Login guardado en store:', {
                nombre: this.user.nombre,
                tipo: this.user.tipo_usuario,
                id: this.user.id_usuario
            });
        },

        logout() {
            console.log('🚪 Cerrando sesión...');
            
            // Limpiar localStorage
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('emprendimiento');
            
            // Limpiar estado
            this.isAuthenticated = false;
            this.user = null;
            this.emprendimiento = null;

            console.log('✅ Sesión cerrada correctamente');
        },

        setEmprendimiento(emprendimiento) {
            this.emprendimiento = emprendimiento;
            localStorage.setItem('emprendimiento', JSON.stringify(emprendimiento));
            console.log('✅ Emprendimiento guardado:', emprendimiento.nombre_negocio);
        },

        clearEmprendimiento() {
            this.emprendimiento = null;
            localStorage.removeItem('emprendimiento');
        }
    }
});
