import { defineStore } from 'pinia';
import { ref, computed } from 'vue';

export const useAuthStore = defineStore('auth', () => {
  // ========== STATE ==========
  const isAuthenticated = ref(false);
  const user = ref(null);
  const emprendimiento = ref(null);
  const isLoading = ref(false);
  const isInitialized = ref(false); // Asegúrate de tener esta propiedad


  // ========== GETTERS ==========
  const isProveedor = computed(() => user.value?.tipo_usuario === 'proveedor');
  const isCliente = computed(() => user.value?.tipo_usuario === 'cliente');
  const userName = computed(() => user.value?.nombre || '');
  const userId = computed(() => {
    const id = user.value?.id_usuario;
    return id ? parseInt(id, 10) : null;
  });
  const userType = computed(() => user.value?.tipo_usuario || null);
  const hasEmprendimiento = computed(() => !!emprendimiento.value);

  // ========== ACTIONS ==========
  const initializeAuth = () => {
    console.log('🔄 Inicializando autenticación...');
    
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const emprendimientoStr = localStorage.getItem('emprendimiento');

    console.log('  Token:', token ? '✅ Presente' : '❌ No encontrado');
    console.log('  User:', userStr ? '✅ Presente' : '❌ No encontrado');
    console.log('  Emprendimiento:', emprendimientoStr ? '✅ Presente' : '❌ No encontrado');

    if (token && userStr) {
      try {
        const userData = JSON.parse(userStr);
        const normalizedUser = normalizeUserData(userData);
        
        isAuthenticated.value = true;
        user.value = normalizedUser;

        // Cargar emprendimiento si existe
        if (emprendimientoStr) {
          try {
            emprendimiento.value = JSON.parse(emprendimientoStr);
          } catch (e) {
            console.error('❌ Error parseando emprendimiento:', e);
            clearEmprendimiento();
          }
        }

        console.log('✅ Auth inicializado:', {
          nombre: normalizedUser.nombre,
          tipo: normalizedUser.tipo_usuario,
          id: normalizedUser.id_usuario,
          hasEmprendimiento: !!emprendimiento.value
        });

      } catch (error) {
        console.error('❌ Error inicializando auth:', error);
        logout();
      }
    } else {
      console.log('ℹ️ No hay sesión activa');
      logout();
    }
  };

  const login = (token, userData) => {
    console.log('📝 Procesando login...');
    
    try {
      const normalizedUser = normalizeUserData(userData);

      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(normalizedUser));

      // Actualizar estado
      isAuthenticated.value = true;
      user.value = normalizedUser;

      console.log('✅ Login exitoso:', {
        nombre: normalizedUser.nombre,
        tipo: normalizedUser.tipo_usuario,
        id: normalizedUser.id_usuario
      });

      return true;
    } catch (error) {
      console.error('❌ Error en login:', error);
      logout();
      return false;
    }
  };

  const logout = () => {
    console.log('🚪 Cerrando sesión...');
    
    // Limpiar localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('emprendimiento');
    
    // Limpiar estado
    isAuthenticated.value = false;
    user.value = null;
    emprendimiento.value = null;

    console.log('✅ Sesión cerrada correctamente');
  };

  const setEmprendimiento = (emprendimientoData) => {
    try {
      emprendimiento.value = emprendimientoData;
      localStorage.setItem('emprendimiento', JSON.stringify(emprendimientoData));
      console.log('✅ Emprendimiento guardado:', emprendimientoData.nombre_negocio);
      return true;
    } catch (error) {
      console.error('❌ Error guardando emprendimiento:', error);
      return false;
    }
  };

  const clearEmprendimiento = () => {
    emprendimiento.value = null;
    localStorage.removeItem('emprendimiento');
    console.log('✅ Emprendimiento eliminado');
  };

  const updateUserProfile = (updatedData) => {
    if (!user.value) return false;

    try {
      const updatedUser = { ...user.value, ...updatedData };
      user.value = updatedUser;
      localStorage.setItem('user', JSON.stringify(updatedUser));
      console.log('✅ Perfil actualizado');
      return true;
    } catch (error) {
      console.error('❌ Error actualizando perfil:', error);
      return false;
    }
  };

  // ========== UTILITIES ==========
  const normalizeUserData = (userData) => {
    const normalized = { ...userData };
    
    // Normalizar IDs a números
    if (normalized.id_usuario && typeof normalized.id_usuario === 'string') {
      normalized.id_usuario = parseInt(normalized.id_usuario, 10);
    }
    
    // Asegurar campos requeridos
    normalized.tipo_usuario = normalized.tipo_usuario || 'cliente';
    
    return normalized;
  };

  const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // ========== EXPOSE ==========
  return {
    // State
    isAuthenticated,
    user,
    emprendimiento,
    isLoading,
    
    // Getters
    isProveedor,
    isCliente,
    userName,
    userId,
    userType,
    hasEmprendimiento,
    
    // Actions
    initializeAuth,
    login,
    logout,
    setEmprendimiento,
    clearEmprendimiento,
    updateUserProfile,
    getAuthHeaders
  };
});