<template>
    <div class="form-container">
        <h3>Registrar mi emprendimiento</h3>
        <form @submit.prevent="crearEmprendimiento">
            <input v-model="nombre" placeholder="Nombre del negocio" required />
            <input v-model="direccion" placeholder="Dirección" required />
            <input v-model="horario" placeholder="Horario (ej. 9:00 a 18:00)" />
            <textarea v-model="descripcion" placeholder="Descripción del negocio"></textarea>
            <button type="submit" :disabled="loading">
                {{ loading ? 'Guardando...' : 'Guardar' }}
            </button>
            <p v-if="mensaje" class="mensaje">{{ mensaje }}</p>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../store'

const router = useRouter()
const authStore = useAuthStore()

const nombre = ref('')
const direccion = ref('')
const horario = ref('')
const descripcion = ref('')
const loading = ref(false)
const mensaje = ref('')

async function crearEmprendimiento() {
    loading.value = true
    mensaje.value = ''
    
    try {
        const token = localStorage.getItem('token')
        
        const response = await fetch('http://localhost:4000/api/emprendimientos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                nombre_negocio: nombre.value,
                direccion: direccion.value,
                horario_atencion: horario.value,
                descripcion: descripcion.value
            })
        })

        if (!response.ok) {
            const errorData = await response.json()
            throw new Error(errorData.error || 'Error al crear emprendimiento')
        }

        const emprendimiento = await response.json()
        
        // Actualizar el store con el nuevo emprendimiento
        authStore.setEmprendimiento(emprendimiento)
        
        mensaje.value = '¡Emprendimiento creado con éxito!'
        
        // Redirigir al dashboard después de 1 segundo
        setTimeout(() => {
            router.push('/dashboard')
        }, 1000)
        
    } catch (error) {
        console.error('Error:', error)
        mensaje.value = error.message || 'Error al crear emprendimiento'
    } finally {
        loading.value = false
    }
}
</script>

<style scoped>
.form-container {
    max-width: 500px;
    margin: 0 auto;
    padding: 2rem;
}

.form-container h3 {
    text-align: center;
    color: #791236;
    margin-bottom: 2rem;
}

form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

input, textarea {
    padding: 0.75rem;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 1rem;
}

input:focus, textarea:focus {
    outline: none;
    border-color: #791236;
}

button {
    background: #791236;
    color: white;
    border: none;
    padding: 1rem;
    border-radius: 8px;
    font-size: 1.1rem;
    cursor: pointer;
}

button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.mensaje {
    text-align: center;
    color: #791236;
    font-weight: bold;
}
</style>