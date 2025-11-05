import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', {
    state: () => ({
        token: localStorage.getItem('token') || null,
        usuario: null,
    }),
    actions: {
        login(token, usuario) {
            this.token = token;
            this.usuario = usuario;
            localStorage.setItem('token', token);
        },
        logout() {
            this.token = null;
            this.usuario = null;
            localStorage.removeItem('token');
        }
    },
    getters: {
        isAuthenticated: (state) => !!state.token
    }
});
