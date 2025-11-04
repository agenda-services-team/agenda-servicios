<!-- src/views/FormServicio.vue -->
<template>
  <div class="form-servicio-container">
    <div class="form-card">
      <h2>{{ modoEdicion ? 'Editar Servicio' : 'Agregar Nuevo Servicio' }}</h2>
      
      <!-- Mensaje de error si no tiene emprendimiento -->
      <div v-if="!emprendimientoId" class="error-emprendimiento">
        <div class="error-icon">⚠️</div>
        <h3>Primero debes registrar un emprendimiento</h3>
        <p>Para poder crear servicios, necesitas tener un emprendimiento registrado.</p>
        <router-link to="/dashboard/emprendimiento" class="btn-registrar-empre">
          Registrar Emprendimiento
        </router-link>
      </div>

      <!-- Formulario (solo si tiene emprendimiento) -->
      <form v-else @submit.prevent="submitForm" class="servicio-form">
        <!-- Nombre del servicio -->
        <div class="form-group">
          <label for="nombre_servicio">Nombre del Servicio *</label>
          <input 
            type="text" 
            id="nombre_servicio"
            v-model="formData.nombre_servicio"
            placeholder="Ej: Corte de cabello"
            required
          />
        </div>

        <!-- Descripción -->
        <div class="form-group">
          <label for="descripcion">Descripción</label>
          <textarea 
            id="descripcion"
            v-model="formData.descripcion"
            placeholder="Describe el servicio..."
            rows="4"
          ></textarea>
        </div>

        <!-- Precio y Duración -->
        <div class="form-row">
          <div class="form-group">
            <label for="precio">Precio *</label>
            <input 
              type="number" 
              id="precio"
              v-model.number="formData.precio"
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div class="form-group">
            <label for="duracion">Duración (minutos)</label>
            <input 
              type="number" 
              id="duracion"
              v-model.number="formData.duracion"
              placeholder="30"
              min="0"
            />
          </div>
        </div>

        <!-- Imagen -->
        <div class="form-group">
          <label for="imagen">Imagen del Servicio</label>
          <input 
            type="file" 
            id="imagen"
            @change="handleImageChange"
            accept="image/*"
          />
          <small>Formatos: JPG, PNG (máx. 2MB)</small>
        </div>

        <!-- Preview de imagen -->
        <div v-if="imagePreview" class="image-preview">
          <img :src="imagePreview" alt="Preview" />
          <button type="button" @click="removeImage" class="btn-remove-image">
            ✕ Eliminar
          </button>
        </div>

        <!-- Mensaje -->
        <div v-if="mensaje" class="mensaje" :class="{ error: mensaje.includes('Error') }">
          {{ mensaje }}
        </div>

        <!-- Botones -->
        <div class="form-actions">
          <button type="submit" class="btn-primary" :disabled="loading">
            <span v-if="!loading">{{ modoEdicion ? 'Actualizar' : 'Guardar Servicio' }}</span>
            <span v-else>Guardando...</span>
          </button>
          <button type="button" @click="cancelar" class="btn-secondary">
            Cancelar
          </button>
        </div>
      </form>

      <!-- Lista de servicios -->
      <div v-if="emprendimientoId && servicios.length > 0" class="servicios-list">
        <h3>Servicios Registrados</h3>
        <div class="servicios-grid">
          <div v-for="servicio in servicios" :key="servicio.id_servicio" class="servicio-card">
            <img 
              :src="servicio.imagen_referencia || 'https://via.placeholder.com/150'" 
              :alt="servicio.nombre_servicio"
              class="servicio-img"
            />
            <div class="servicio-info">
              <h4>{{ servicio.nombre_servicio }}</h4>
              <p>{{ servicio.descripcion }}</p>
              <div class="servicio-detalles">
                <span class="precio">${{ servicio.precio }}</span>
                <span class="duracion">{{ servicio.duracion }} min</span>
              </div>
            </div>
            <div class="servicio-actions">
              <button @click="editarServicio(servicio)" class="btn-edit">
                ✏️ Editar
              </button>
              <button @click="eliminarServicio(servicio.id_servicio)" class="btn-delete">
                🗑️ Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '../store';

export default {
  name: 'FormServicio',
  
  data() {
    return {
      formData: {
        nombre_servicio: '',
        descripcion: '',
        precio: null,
        duracion: null
      },
      imagenFile: null,
      imagePreview: null,
      mensaje: '',
      loading: false,
      modoEdicion: false,
      servicioEditId: null,
      servicios: [],
      emprendimientoId: null
    }
  },
  
  setup() {
    const authStore = useAuthStore();
    return { authStore };
  },
  
  async mounted() {
    await this.verificarEmprendimiento();
    if (this.emprendimientoId) {
      await this.cargarServicios();
    }
  },
  
  methods: {
    async verificarEmprendimiento() {
      try {
        const userId = this.authStore.userId;
        console.log('🔍 Verificando emprendimiento para usuario:', userId);

        const response = await axios.get(
          `http://localhost:4000/api/emprendimientos/usuario/${userId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        if (response.data.tieneEmprendimiento) {
          this.emprendimientoId = response.data.emprendimiento.id_emprendimiento;
          this.authStore.setEmprendimiento(response.data.emprendimiento);
          console.log('✅ Emprendimiento encontrado:', this.emprendimientoId);
        } else {
          console.log('⚠️ Usuario no tiene emprendimiento');
        }

      } catch (error) {
        console.error('❌ Error verificando emprendimiento:', error);
        if (error.response?.status !== 404) {
          this.mensaje = 'Error al verificar emprendimiento';
        }
      }
    },

    async cargarServicios() {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/servicios/emprendimiento/${this.emprendimientoId}`,
          {
            headers: {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            }
          }
        );

        this.servicios = response.data;
        console.log('✅ Servicios cargados:', this.servicios.length);

      } catch (error) {
        console.error('❌ Error cargando servicios:', error);
      }
    },

    handleImageChange(event) {
      const file = event.target.files[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          this.mensaje = 'La imagen no debe superar 2MB';
          event.target.value = '';
          return;
        }

        this.imagenFile = file;
        
        // Preview
        const reader = new FileReader();
        reader.onload = (e) => {
          this.imagePreview = e.target.result;
        };
        reader.readAsDataURL(file);

        console.log('✅ Imagen seleccionada:', file.name);
      }
    },

    removeImage() {
      this.imagenFile = null;
      this.imagePreview = null;
      document.getElementById('imagen').value = '';
    },

    async submitForm() {
      if (!this.emprendimientoId) {
        this.mensaje = 'Error: No tienes un emprendimiento registrado';
        return;
      }

      if (!this.formData.nombre_servicio.trim()) {
        this.mensaje = 'El nombre del servicio es obligatorio';
        return;
      }

      if (!this.formData.precio || this.formData.precio <= 0) {
        this.mensaje = 'El precio debe ser mayor a 0';
        return;
      }

      this.loading = true;
      this.mensaje = '';

      try {
        const formDataToSend = new FormData();
        
        formDataToSend.append('id_emprendimiento', this.emprendimientoId);
        formDataToSend.append('nombre_servicio', this.formData.nombre_servicio.trim());
        formDataToSend.append('descripcion', this.formData.descripcion.trim());
        formDataToSend.append('precio', this.formData.precio);
        formDataToSend.append('duracion', this.formData.duracion || 0);

        if (this.imagenFile) {
          formDataToSend.append('imagen', this.imagenFile);
        }

        console.log('📤 Enviando servicio...');
        for (let [key, value] of formDataToSend.entries()) {
          console.log(`  ${key}:`, value);
        }

        const url = this.modoEdicion
          ? `http://localhost:4000/api/servicios/${this.servicioEditId}`
          : 'http://localhost:4000/api/servicios';

        const method = this.modoEdicion ? 'put' : 'post';

        const response = await axios[method](url, formDataToSend, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        console.log('✅ Servicio guardado:', response.data);

        this.mensaje = `✅ Servicio ${this.modoEdicion ? 'actualizado' : 'creado'} con éxito`;
        
        this.resetForm();
        await this.cargarServicios();

      } catch (error) {
        console.error('❌ Error al guardar servicio:', error);
        
        const errorData = error.response?.data;
        this.mensaje = errorData?.mensaje || 
                      errorData?.error || 
                      'Error al guardar el servicio';

      } finally {
        this.loading = false;
      }
    },

    editarServicio(servicio) {
      this.modoEdicion = true;
      this.servicioEditId = servicio.id_servicio;
      
      this.formData = {
        nombre_servicio: servicio.nombre_servicio,
        descripcion: servicio.descripcion || '',
        precio: servicio.precio,
        duracion: servicio.duracion || null
      };

      if (servicio.imagen_referencia) {
        this.imagePreview = servicio.imagen_referencia;
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    async eliminarServicio(id) {
      if (!confirm('¿Estás seguro de eliminar este servicio?')) {
        return;
      }

      try {
        await axios.delete(`http://localhost:4000/api/servicios/${id}`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        this.mensaje = '✅ Servicio eliminado';
        await this.cargarServicios();

      } catch (error) {
        console.error('❌ Error al eliminar:', error);
        this.mensaje = 'Error al eliminar el servicio';
      }
    },

    resetForm() {
      this.formData = {
        nombre_servicio: '',
        descripcion: '',
        precio: null,
        duracion: null
      };
      this.imagenFile = null;
      this.imagePreview = null;
      this.modoEdicion = false;
      this.servicioEditId = null;
      document.getElementById('imagen').value = '';
    },

    cancelar() {
      this.resetForm();
      this.mensaje = '';
    }
  }
}
</script>

<style scoped>
.form-servicio-container {
  min-height: 100vh;
  background: #f5f7fa;
  padding: 2rem;
}

.form-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.form-card h2 {
  color: #791236;
  margin-bottom: 2rem;
  font-size: 1.8rem;
}

.error-emprendimiento {
  text-align: center;
  padding: 3rem 2rem;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.error-emprendimiento h3 {
  color: #791236;
  margin-bottom: 1rem;
}

.btn-registrar-empre {
  display: inline-block;
  margin-top: 1.5rem;
  padding: 0.75rem 2rem;
  background: #791236;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 600;
}

.servicio-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  font-weight: 600;
  color: #333;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #791236;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.image-preview {
  position: relative;
  width: 200px;
}

.image-preview img {
  width: 100%;
  border-radius: 8px;
}

.btn-remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 4px 8px;
  cursor: pointer;
}

.mensaje {
  padding: 1rem;
  border-radius: 8px;
  background: #d4edda;
  color: #155724;
}

.mensaje.error {
  background: #f8d7da;
  color: #721c24;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.btn-primary, .btn-secondary {
  padding: 0.75rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  border: none;
}

.btn-primary {
  background: #791236;
  color: white;
}

.btn-primary:disabled {
  background: #ccc;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.servicios-list {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 2px solid #e0e0e0;
}

.servicios-grid {
  display: grid;
  gap: 1rem;
  margin-top: 1rem;
}

.servicio-card {
  display: flex;
  gap: 1rem;
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
}

.servicio-img {
  width: 100px;
  height: 100px;
  object-fit: cover;
  border-radius: 8px;
}

.servicio-info {
  flex: 1;
}

.servicio-detalles {
  display: flex;
  gap: 1rem;
  margin-top: 0.5rem;
}

.precio {
  color: #791236;
  font-weight: bold;
}

.servicio-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.btn-edit, .btn-delete {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
}

.btn-edit {
  background: #ffc107;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

@media (max-width: 768px) {
  .form-row {
    grid-template-columns: 1fr;
  }
  
  .servicio-card {
    flex-direction: column;
  }
}
</style>