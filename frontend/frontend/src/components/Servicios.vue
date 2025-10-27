<template>
    <div>
        <h2>Servicios</h2>

        <!-- Formulario crear servicio -->
        <div>
            <h3>Crear Servicio</h3>
            <input v-model="nombre_servicio" placeholder="Nombre del servicio" />
            <input v-model="descripcion" placeholder="Descripción" />
            <input v-model.number="precio" type="number" placeholder="Precio" />
            <input v-model.number="duracion" type="number" placeholder="Duración (minutos)" />
            <button @click="crearServicio">Crear Servicio</button>
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
    props: {
        searchTerm: {
            type: String,
            default: ''
        }
    },
    watch: {
        searchTerm(newTerm) {
            this.filtroBusqueda = newTerm;
        }
    },
    data() {
        return {
            servicios: [],
            nombre_servicio: '',  // Cambio de nombre a nombre_servicio para match con backend
            descripcion: '',
            precio: 0,
            duracion: 0,  // Añadido campo duracion
            mensaje: ''
        };
    },
    methods: {
        async listarServicios() {
            const token = localStorage.getItem('token');
            try {
                // Primero intentamos obtener los servicios como proveedor
                if (token) {
                    try {
                        const res = await axios.get('http://localhost:4000/api/servicios/proveedor/mis-servicios', {
                            headers: { Authorization: `Bearer ${token}` }
                        });
                        console.log('✅ Servicios del proveedor cargados:', res.data);
                        this.servicios = res.data;
                        return;
                    } catch (err) {
                        console.log('No es proveedor o token inválido, intentando endpoint público');
                    }
                }

                // Si no hay token o no es proveedor, usar endpoint público
                const resPublic = await axios.get('http://localhost:4000/api/servicios/public/todos');
                console.log('✅ Servicios públicos cargados:', resPublic.data);
                this.servicios = resPublic.data;
            } catch (err) {
                console.error('❌ Error al cargar servicios:', err);
                this.mensaje = err.response?.data?.error || err.response?.data || 'Error al obtener servicios';
            }
        },
        async crearServicio() {
            const token = localStorage.getItem('token');
            try {
                // El endpoint backend espera campos como nombre_servicio, descripcion, precio, duracion
                await axios.post(
                    'http://localhost:4000/api/servicios',
                    { nombre_servicio: this.nombre, descripcion: this.descripcion, precio: this.precio, duracion: this.duracion },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                this.mensaje = 'Servicio creado';
                this.nombre = '';
                this.descripcion = '';
                this.precio = 0;
                this.duracion = 0;
                this.listarServicios();
            } catch (err) {
                // Mostrar mensaje de error más informativo
                this.mensaje = err.response?.data?.error || err.response?.data || 'Error al crear servicio';
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
