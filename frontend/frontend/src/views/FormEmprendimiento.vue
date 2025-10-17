<template>
    <div class="form-container">
        <h3>Registrar mi emprendimiento</h3>
        <form @submit.prevent="crearEmprendimiento">
            <input v-model="nombre" placeholder="Nombre del negocio" required />
            <input v-model="direccion" placeholder="Dirección" required />
            <input v-model="horario" placeholder="Horario (ej. 9:00 a 18:00)" />
            <textarea v-model="descripcion" placeholder="Descripción del negocio"></textarea>
            <button type="submit">Guardar</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import axios from 'axios'

const nombre = ref('')
const direccion = ref('')
const horario = ref('')
const descripcion = ref('')

async function crearEmprendimiento() {
    const id_usuario = localStorage.getItem('id_usuario')
    await axios.post('http://localhost:4000/api/emprendimientos', {
        id_usuario,
        nombre: nombre.value,
        direccion: direccion.value,
        horario: horario.value,
        descripcion: descripcion.value
    })
    alert('Emprendimiento creado con éxito!')
}
</script>
