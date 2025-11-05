<template>
    <div>
        <h2>Servicios</h2>

        <!-- Formulario crear servicio -->
        <div>
            <h3>Crear Servicio</h3>
            <input v-model="nombre" placeholder="Nombre" />
            <input v-model="descripcion" placeholder="Descripción" />
            <input v-model.number="precio" type="number" placeholder="Precio" />
            <button @click="crearServicio">Crear</button>
            <p>{{ mensaje }}</p>
        </div>

        <!-- Lista de servicios -->
        <div>
            <h3>Todos los servicios</h3>
            <ul>
                <li v-for="s in servicios" :key="s.id_servicio">
                    {{ s.nombre }} - {{ s.descripcion }} - ${{ s.precio }}
                    <button @click="editarServicio(s)">Editar</button>
                    <button @click="eliminarServicio(s.id_servicio)">Eliminar</button>
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
            nombre: '',
            descripcion: '',
            precio: 0,
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
        async crearServicio() {
            const token = localStorage.getItem('token');
            try {
                await axios.post(
                    'http://localhost:4000/servicios',
                    { nombre: this.nombre, descripcion: this.descripcion, precio: this.precio },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                this.mensaje = 'Servicio creado';
                this.nombre = '';
                this.descripcion = '';
                this.precio = 0;
                this.listarServicios();
            } catch (err) {
                this.mensaje = err.response?.data || 'Error al crear servicio';
            }
        },
        async editarServicio(servicio) {
            const nuevoNombre = prompt("Nuevo nombre", servicio.nombre);
            const nuevaDescripcion = prompt("Nueva descripción", servicio.descripcion);
            const nuevoPrecio = parseFloat(prompt("Nuevo precio", servicio.precio));
            const token = localStorage.getItem('token');

            try {
                await axios.put(
                    `http://localhost:4000/servicios/${servicio.id_servicio}`,
                    { nombre: nuevoNombre, descripcion: nuevaDescripcion, precio: nuevoPrecio },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                this.listarServicios();
            } catch (err) {
                this.mensaje = err.response?.data || 'Error al actualizar servicio';
            }
        },
        async eliminarServicio(id) {
            const token = localStorage.getItem('token');
            if (!confirm("¿Eliminar este servicio?")) return;

            try {
                await axios.delete(`http://localhost:4000/servicios/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                this.listarServicios();
            } catch (err) {
                this.mensaje = err.response?.data || 'Error al eliminar servicio';
            }
        }
    },
    mounted() {
        this.listarServicios();
    }
};
</script>
