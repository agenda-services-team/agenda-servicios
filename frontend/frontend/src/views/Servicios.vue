<template>
    <div class="services-header">
        <h1 class="services-title">Mis Servicios</h1>
        <br>
    </div>

    <div class="row">
        <div v-for="servicio in servicios" :key="servicio.id_servicio || servicio.id" class="card me-3"
            style="width: 18rem;">
            <img :src="servicio.imagen_referencia || servicio.imagen || '/images/default-service.jpg'"
                class="card-img-top" alt="Imagen del servicio" />
            <div class="card-body">
                <h5 class="card-title">{{ servicio.nombre }}</h5>
                <p class="card-text">{{ servicio.descripcion }}</p>
                <div class="mt-2">
                    <a href="#" class="btn btn-primary me-2">Ver más</a>
                    <a href="#" class="btn btn-danger" @click.prevent="eliminarServicio(servicio.id_servicio)">
                        Eliminar
                    </a>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
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
