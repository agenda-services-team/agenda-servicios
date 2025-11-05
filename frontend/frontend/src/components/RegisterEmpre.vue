<template>
    <div class="form-container">
        <h3>Registrar mi emprendimiento</h3>
        <p class="welcome-message">
            Bienvenido {{ nombreUsuario }}, para poder ofrecer tus servicios, es necesario que registres los datos de tu
            emprendimiento. Una vez creado, podrás navegar a las demás opciones, agregar servicios y gestionar su
            control.
        </p>
        <form @submit.prevent="crearEmprendimiento">
            <div class="form-group">
                <label for="nombre">Nombre del negocio</label>
                <input id="nombre" v-model="nombre" placeholder="Nombre del negocio" required />
            </div>
            <div class="form-group">
                <label for="Descripcion">Descripción del negocio</label>
                <input id="descripcion" v-model="descripcion" placeholder="Descripcion del negocio"></input>
            </div>
            <div class="form-group">
                <label for="domicilio">Dirección</label>
                <input id="domicilio" v-model="domicilio" placeholder="Domicilio" required />
            </div>
            <div class="form-group">
                <label for="horaInicio">Hora de inicio</label>
                <input id="horaInicio" type="time" v-model="horaInicio" required />
            </div>
            <div class="form-group">
                <label for="horaCierre">Hora de cierre</label>
                <input id="horaCierre" type="time" v-model="horaCierre" required />
            </div>
            <label for="logo">Logo del negocio</label>
            <input id="logo" type="file" accept="image/*" @change="onFileChangeLogo" />
            <button type="submit">Guardar</button>
            <p v-if="mensaje" class="error-message">{{ mensaje }}</p>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useRouter } from 'vue-router';

const nombre = ref('');
const domicilio = ref('');
const horaInicio = ref('');
const horaCierre = ref('');
const descripcion = ref('');
const logo = ref(null);
const mensaje = ref(''); // Para mostrar mensajes de error
const router = useRouter();
const nombreUsuario = ref(localStorage.getItem('nombre') || 'Usuario'); // Obtener el nombre del usuario

function onFileChangeLogo(event) {
    const file = event.target.files[0];
    if (file) {
        logo.value = file;
    }
}

async function crearEmprendimiento() {
    try {
        const id_usuario = localStorage.getItem('id_usuario');
        console.log('ID del proveedor:', id_usuario); // Verificar que se obtiene el ID correctamente
        if (!id_usuario) {
            mensaje.value = 'No se encontró el ID del usuario. Por favor, inicia sesión nuevamente.';
            return;
        }

        const formData = new FormData();
        formData.append('id_proveedor', id_usuario);
        formData.append('nombre_negocio', nombre.value);
        formData.append('descripcion', descripcion.value);
        formData.append('domicilio', domicilio.value);
        // Enviar los nombres que el backend espera: hora_apertura y hora_cierre
        formData.append('hora_apertura', horaInicio.value);
        formData.append('hora_cierre', horaCierre.value);

        if (logo.value) {
            formData.append('logo', logo.value); // aquí agregamos el logo
        }

        console.log('Enviando formData para crear emprendimiento:', {
            id_usuario,
            nombre: nombre.value,
            descripcion: descripcion.value,
            domicilio: domicilio.value,
            hora_apertura: horaInicio.value,
            hora_cierre: horaCierre.value,
            tieneLogo: !!logo.value
        });

        await axios.post('http://localhost:4000/api/emprendimientos', formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });

        alert('Emprendimiento creado con éxito!');
        router.push('/dashboard');
    } catch (error) {
        console.error('Error al crear emprendimiento:', error);
        mensaje.value = error.response?.data || 'Error al crear el emprendimiento';
    }
}

</script>

<style scoped>
.form-container {
    max-width: 900px;
    margin: 40px auto;
    padding: 30px;
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

h3 {
    text-align: center;
    color: #791236;
    margin-bottom: 15px;
    font-size: 1.8em;
}

.welcome-message {
    text-align: center;
    color: #333;
    font-size: 1.1em;
    margin-bottom: 25px;
    line-height: 1.5;
}

.form-group {
    margin-bottom: 20px;
}

label {
    display: block;
    color: #791236;
    font-weight: 600;
    margin-bottom: 8px;
}

input,
textarea {
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 6px;
    font-size: 1em;
    box-sizing: border-box;
}

textarea {
    min-height: 120px;
    resize: vertical;
}

button {
    width: 100%;
    background: #791236;
    color: #fff;
    border: none;
    padding: 12px;
    border-radius: 6px;
    font-size: 1.1em;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s;
}

button:hover {
    background: #a31d4a;
}

.error-message {
    color: #c00;
    text-align: center;
    margin-top: 15px;
    font-size: 0.9em;
}
</style>