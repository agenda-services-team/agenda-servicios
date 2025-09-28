<template>
    <div>
        <h2>Citas</h2>

        <!-- Crear cita -->
        <div>
            <h3>Reservar nueva cita</h3>
            <select v-model="id_servicio">
                <option disabled value="">Selecciona un servicio</option>
                <option v-for="s in servicios" :key="s.id_servicio" :value="s.id_servicio">
                    {{ s.nombre }} - ${{ s.precio }}
                </option>
            </select>
            <input type="date" v-model="fecha" />
            <input type="time" v-model="hora" />
            <button @click="crearCita">Reservar</button>
            <p>{{ mensaje }}</p>
        </div>

        <!-- Lista de citas -->
        <div>
            <h3>Mis citas</h3>
            <ul>
                <li v-for="c in citas" :key="c.id_cita">
                    {{ c.servicio }} - {{ c.fecha }} {{ c.hora }} - Estado: {{ c.estado }}
                    <button @click="eliminarCita(c.id_cita)">Cancelar</button>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            servicios: [],
            citas: [],
            id_servicio: '',
            fecha: '',
            hora: '',
            mensaje: ''
        };
    },
    methods: {
        async listarServicios() {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://localhost:4000/servicios', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                this.servicios = res.data;
            } catch (err) {
                this.mensaje = err.response?.data || 'Error al obtener servicios';
            }
        },
        async listarCitas() {
            const token = localStorage.getItem('token');
            try {
                const res = await axios.get('http://localhost:4000/citas', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                this.citas = res.data;
            } catch (err) {
                this.mensaje = err.response?.data || 'Error al obtener citas';
            }
        },
        async crearCita() {
            const token = localStorage.getItem('token');
            try {
                await axios.post(
                    'http://localhost:4000/citas',
                    { id_servicio: this.id_servicio, fecha: this.fecha, hora: this.hora },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                this.mensaje = 'Cita creada';
                this.id_servicio = '';
                this.fecha = '';
                this.hora = '';
                this.listarCitas();
            } catch (err) {
                this.mensaje = err.response?.data || 'Error al crear cita';
            }
        },
        async eliminarCita(id) {
            const token = localStorage.getItem('token');
            if (!confirm("¿Cancelar esta cita?")) return;

            try {
                await axios.delete(`http://localhost:4000/citas/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                this.listarCitas();
            } catch (err) {
                this.mensaje = err.response?.data || 'Error al eliminar cita';
            }
        }
    },
    mounted() {
        this.listarServicios();
        this.listarCitas();
    }
};
</script>
