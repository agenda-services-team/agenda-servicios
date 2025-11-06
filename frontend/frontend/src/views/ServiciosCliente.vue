<template>
    <div class="servicios-page">
        <header-servicios />
        <section class="hero-fullscreen"></section>
    </div>
</template>

<script>
import HeaderServicios from '../components/HeaderServicios.vue';
export default {
    components: {
        HeaderServicios
    },
    data() {
        return {
            servicios: []
        }
    },
    mounted() {
        this.cargarServicios();
    },
    methods: {
        async cargarServicios() {
            try {
                const token = localStorage.getItem("token");
                const respuesta = await fetch("http://localhost:4000/api/servicios", {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                console.log("Código de respuesta:", respuesta.status);

                if (!respuesta.ok) throw new Error("Error al obtener los servicios");

                const data = await respuesta.json();
                console.log("Servicios obtenidos:", data);

                this.servicios = data;
            } catch (error) {
                console.error("Error al cargar los servicios:", error);
            }
        },
        async eliminarServicio(id) {
            if (!confirm("¿Seguro que deseas eliminar este servicio?")) {
                return;
            }

            try {
                const token = localStorage.getItem("token");
                console.log("Usuario autenticado:", req.usuario);

                const respuesta = await fetch(`http://localhost:4000/api/servicios/${id}`, {
                    method: "DELETE",
                    headers: {
                        "Authorization": `Bearer ${token}`,
                        "Content-Type": "application/json"
                    }
                });

                if (!respuesta.ok) {
                    const mensaje = await respuesta.text();
                    throw new Error(mensaje || "Error al eliminar el servicio");
                }

                // Eliminar el servicio de la lista local
                this.servicios = this.servicios.filter(s => s.id_servicio !== id);

                alert("Servicio eliminado con éxito");
            } catch (error) {
                console.error("Error al eliminar servicio:", error);
                alert("No se pudo eliminar el servicio");
            }
        }
    }
};
</script>


<style scoped>
.servicios-page {
    height: 100vh;
    width: 100vw;
    /* que es width: es el ancho total de la ventana */
    overflow: hidden;
    display: flex;
    flex-direction: column;
}

.hero-fullscreen {
    flex: 1;
    background-image: url('/src/images/mujer13.jpg');
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
}

.services-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.services-title {
    color: #553a6a;
    font-size: 1.8rem;
    font-weight: 700;
}

.card {
    margin-bottom: 20px;
}
</style>
