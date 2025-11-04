<template>
  <div class="perfil-container">
    <div class="perfil-card">
      <div class="perfil-header">
        <h2>Mi Perfil</h2>
        <button v-if="!editando" @click="editando = true" class="edit-btn">
          <i class="fas fa-edit"></i> Editar
        </button>
      </div>

      <div v-if="!editando" class="perfil-info">
        <div class="info-grupo">
          <label>Nombre:</label>
          <p>{{ userProfile?.nombre || 'No disponible' }}</p>
        </div>
        <div class="info-grupo">
          <label>Correo:</label>
          <p>{{ userProfile?.correo || 'No disponible' }}</p>
        </div>
        <div class="info-grupo">
          <label>Teléfono:</label>
          <p>{{ userProfile?.telefono || 'No disponible' }}</p>
        </div>
        <div class="info-grupo">
          <label>Tipo de Usuario:</label>
          <p>{{ userProfile?.tipo_usuario === 'cliente' ? 'Cliente' : 'Proveedor' }}</p>
        </div>
      </div>

      <form v-else @submit.prevent="guardarCambios" class="perfil-form">
        <div class="form-grupo">
          <label>Nombre:</label>
          <input 
            v-model="formData.nombre" 
            type="text" 
            required
          />
        </div>
        <div class="form-grupo">
          <label>Teléfono:</label>
          <input 
            v-model="formData.telefono" 
            type="tel" 
            required
          />
        </div>
        <div class="form-grupo">
          <label>Correo:</label>
          <p class="correo-readonly">{{ userProfile?.correo }}</p>
        </div>
        <div class="botones">
          <button type="submit" class="guardar-btn">Guardar</button>
          <button type="button" @click="cancelarEdicion" class="cancelar-btn">
            Cancelar
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../store'
import axios from 'axios'

const store = useAuthStore()
const userProfile = ref(null)
const editando = ref(false)
const formData = ref({
  nombre: '',
  telefono: ''
})

const cargarPerfil = async () => {
  try {
    // Usamos los datos del usuario que ya tenemos en localStorage
    userProfile.value = {
      nombre: localStorage.getItem('nombre'),
      correo: localStorage.getItem('correo'),
      telefono: localStorage.getItem('telefono'),
      tipo_usuario: localStorage.getItem('tipo_usuario')
    }
    
    // Inicializar formData con los datos actuales
    formData.value = {
      nombre: userProfile.value.nombre,
      telefono: userProfile.value.telefono
    }
  } catch (error) {
    console.error('Error al cargar perfil:', error)
  }
}

const guardarCambios = async () => {
  try {
    const response = await axios.put(
      `http://localhost:4000/api/usuarios/${store.userId}`,
      formData.value,
      {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      }
    )
    
    // Actualizar localStorage con los nuevos datos
    localStorage.setItem('nombre', formData.value.nombre)
    localStorage.setItem('telefono', formData.value.telefono)
    
    await cargarPerfil()
    editando.value = false
  } catch (error) {
    console.error('Error al actualizar perfil:', error)
  }
}

const cancelarEdicion = () => {
  editando.value = false
  // Restaurar los valores originales
  formData.value = {
    nombre: userProfile.value.nombre,
    telefono: userProfile.value.telefono
  }
}

onMounted(() => {
  cargarPerfil()
})
</script>

<style scoped>
.perfil-container {
  max-width: 800px;
  margin: 2rem auto;
  padding: 0 1rem;
}

.perfil-card {
  background: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.perfil-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.edit-btn {
  background: #4299e1;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.info-grupo, .form-grupo {
  margin-bottom: 1.5rem;
}

.info-grupo label, .form-grupo label {
  font-weight: bold;
  display: block;
  margin-bottom: 0.5rem;
  color: #4a5568;
}

.form-grupo input {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #e2e8f0;
  border-radius: 4px;
}

.botones {
  display: flex;
  gap: 1rem;
  margin-top: 1.5rem;
}

.guardar-btn, .cancelar-btn {
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.guardar-btn {
  background: #48bb78;
  color: white;
  border: none;
}

.cancelar-btn {
  background: #e53e3e;
  color: white;
  border: none;
}

.correo-readonly {
  color: #666;
  padding: 0.5rem;
  background: #f5f5f5;
  border-radius: 4px;
  margin: 0;
}
</style>