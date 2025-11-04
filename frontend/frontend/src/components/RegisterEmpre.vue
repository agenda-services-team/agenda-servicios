<template>
    <div class="register-empre-container">
        <div class="form-card">
            <h2>Registra tu Emprendimiento</h2>
            <p class="subtitle">Completa la información de tu negocio</p>

            <form @submit.prevent="crearEmprendimiento" class="empre-form">
                <!-- Nombre del Negocio -->
                <div class="form-group">
                    <label for="nombre_negocio">Nombre del Negocio *</label>
                    <input 
                        type="text" 
                        id="nombre_negocio"
                        v-model="formData.nombre_negocio"
                        placeholder="Ej: Salón Belleza Oaxaca"
                        required
                    />
                </div>

                <!-- Descripción -->
                <div class="form-group">
                    <label for="descripcion">Descripción</label>
                    <textarea 
                        id="descripcion"
                        v-model="formData.descripcion"
                        placeholder="Describe tu negocio..."
                        rows="4"
                    ></textarea>
                </div>

                <!-- Domicilio -->
                <div class="form-group">
                    <label for="domicilio">Domicilio</label>
                    <input 
                        type="text" 
                        id="domicilio"
                        v-model="formData.domicilio"
                        placeholder="Calle, número, colonia"
                    />
                </div>

                <!-- Horarios -->
                <div class="form-row">
                    <div class="form-group">
                        <label for="hora_apertura">Hora de Apertura</label>
                        <input 
                            type="time" 
                            id="hora_apertura"
                            v-model="formData.hora_apertura"
                        />
                    </div>

                    <div class="form-group">
                        <label for="hora_cierre">Hora de Cierre</label>
                        <input 
                            type="time" 
                            id="hora_cierre"
                            v-model="formData.hora_cierre"
                        />
                    </div>
                </div>

                <!-- Logo -->
                <div class="form-group">
                    <label for="logo">Logo del Negocio</label>
                    <input 
                        type="file" 
                        id="logo"
                        @change="handleLogoChange"
                        accept="image/*"
                    />
                    <small>Formatos: JPG, PNG (máx. 2MB)</small>
                </div>

                <!-- Imágenes de trabajos -->
                <div class="form-group">
                    <label for="imagenes">Galería de Trabajos</label>
                    <input 
                        type="file" 
                        id="imagenes"
                        @change="handleImagenesChange"
                        accept="image/*"
                        multiple
                    />
                    <small>Puedes seleccionar varias imágenes</small>
                </div>

                <!-- Mensaje de error/éxito -->
                <div v-if="mensaje" class="mensaje" :class="{ error: mensaje.includes('Error') }">
                    {{ mensaje }}
                </div>

                <!-- Botones -->
                <div class="form-actions">
                    <button type="submit" class="btn-primary" :disabled="loading">
                        <span v-if="!loading">Registrar Emprendimiento</span>
                        <span v-else>Registrando...</span>
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import { useAuthStore } from '../store';

export default {
    name: 'RegisterEmpre',
    
    data() {
        return {
            formData: {
                nombre_negocio: '',
                descripcion: '',
                domicilio: '',
                hora_apertura: '',
                hora_cierre: '',
            },
            logoFile: null,
            imagenesFiles: [],
            mensaje: '',
            loading: false
        }
    },
    
    setup() {
        const authStore = useAuthStore();
        return { authStore };
    },
    
    computed: {
        userId() {
            const id = this.authStore.user?.id_usuario;
            console.log('📌 User ID detectado:', id, 'Tipo:', typeof id);
            return id;
        }
    },
    
    methods: {
        handleLogoChange(event) {
            const file = event.target.files[0];
            if (file) {
                // Validar tamaño (2MB)
                if (file.size > 2 * 1024 * 1024) {
                    this.mensaje = 'El logo no debe superar 2MB';
                    event.target.value = '';
                    return;
                }
                this.logoFile = file;
                console.log('✅ Logo seleccionado:', file.name);
            }
        },
        
        handleImagenesChange(event) {
            const files = Array.from(event.target.files);
            
            // Validar cantidad (máx 10)
            if (files.length > 10) {
                this.mensaje = 'Puedes subir máximo 10 imágenes';
                event.target.value = '';
                return;
            }
            
            // Validar tamaño de cada imagen
            const invalidFiles = files.filter(f => f.size > 2 * 1024 * 1024);
            if (invalidFiles.length > 0) {
                this.mensaje = 'Todas las imágenes deben ser menores a 2MB';
                event.target.value = '';
                return;
            }
            
            this.imagenesFiles = files;
            console.log('✅ Imágenes seleccionadas:', files.length);
        },

        async crearEmprendimiento() {
            // Validación del usuario
            if (!this.userId) {
                this.mensaje = 'Error: No se detectó el usuario autenticado';
                console.error('❌ No hay userId disponible');
                return;
            }

            // Validación del nombre del negocio
            if (!this.formData.nombre_negocio.trim()) {
                this.mensaje = 'El nombre del negocio es obligatorio';
                return;
            }

            this.loading = true;
            this.mensaje = '';

            try {
                const formDataToSend = new FormData();
                
                // Agregar datos del formulario
                formDataToSend.append('id_proveedor', Number(this.userId));
                formDataToSend.append('nombre_negocio', this.formData.nombre_negocio.trim());
                formDataToSend.append('descripcion', this.formData.descripcion.trim());
                formDataToSend.append('domicilio', this.formData.domicilio.trim());
                formDataToSend.append('hora_apertura', this.formData.hora_apertura);
                formDataToSend.append('hora_cierre', this.formData.hora_cierre);

                // Agregar logo si existe
                if (this.logoFile) {
                    formDataToSend.append('logo', this.logoFile);
                }

                // Agregar imágenes si existen
                if (this.imagenesFiles.length > 0) {
                    this.imagenesFiles.forEach(img => {
                        formDataToSend.append('imagenes', img);
                    });
                }

                // Debug: Ver qué se está enviando
                console.log('📤 Datos a enviar:');
                for (let [key, value] of formDataToSend.entries()) {
                    console.log(`  ${key}:`, value, `(tipo: ${typeof value})`);
                }

                const token = localStorage.getItem('token');
                
                if (!token) {
                    this.mensaje = 'Error: No hay token de autenticación';
                    return;
                }

                const response = await axios.post(
                    'http://localhost:4000/api/emprendimientos',
                    formDataToSend,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'Authorization': `Bearer ${token}`
                        }
                    }
                );

                console.log('✅ Emprendimiento creado:', response.data);
                
                this.authStore.setEmprendimiento(response.data.emprendimiento);
                this.mensaje = '✅ Emprendimiento creado con éxito';
                
                // Redireccionar después de 1.5 segundos
                setTimeout(() => {
                    this.$router.push('/dashboard');
                }, 1500);

            } catch (error) {
                console.error('❌ Error al crear emprendimiento:', error);
                console.error('📋 Detalles del error:', error.response?.data);
                
                this.mensaje = error.response?.data?.mensaje || 
                              error.response?.data?.error || 
                              'Error al crear el emprendimiento';
            } finally {
                this.loading = false;
            }
        }
    }
}
</script>

<style scoped>
.register-empre-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
    padding: 40px 20px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.form-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.1);
    padding: 40px;
    max-width: 700px;
    width: 100%;
}

.form-card h2 {
    color: #791236;
    margin-bottom: 8px;
    font-size: 2rem;
}

.subtitle {
    color: #666;
    margin-bottom: 32px;
}

.empre-form {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.form-group label {
    font-weight: 600;
    color: #333;
    font-size: 0.95rem;
}

.form-group input,
.form-group textarea {
    padding: 12px 16px;
    border: 2px solid #e0e0e0;
    border-radius: 8px;
    font-size: 1rem;
    transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus {
    outline: none;
    border-color: #791236;
}

.form-group small {
    color: #666;
    font-size: 0.85rem;
}

.form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 20px;
}

.mensaje {
    padding: 12px;
    border-radius: 8px;
    background: #d4edda;
    color: #155724;
    border: 1px solid #c3e6cb;
}

.mensaje.error {
    background: #f8d7da;
    color: #721c24;
    border-color: #f5c6cb;
}

.form-actions {
    margin-top: 16px;
}

.btn-primary {
    width: 100%;
    padding: 14px;
    background: linear-gradient(135deg, #791236, #a31d4a);
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
}

.btn-primary:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(121, 18, 54, 0.3);
}

.btn-primary:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

@media (max-width: 768px) {
    .form-card {
        padding: 24px;
    }
    
    .form-row {
        grid-template-columns: 1fr;
    }
}
</style>