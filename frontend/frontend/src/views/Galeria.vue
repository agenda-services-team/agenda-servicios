<template>
    <div class="galeria-container">
        <div class="services-header">
            <h2 class="services-title">Mi Galería de Imágenes</h2>
        </div>

        <div class="upload-form">
            <input type="text" v-model="titulo" placeholder="Título (opcional)" class="input-text" />
            <input type="file" accept="image/*" @change="seleccionarArchivo" class="input-file" />
            <button class="btn btn-primary" @click="subirImagen" :disabled="isUploading">
                <span v-if="isUploading">Subiendo...</span>
                <span v-else>Subir imagen</span>
            </button>
        </div>

        <div class="galeria-grid">
            <div v-if="imagenes.length === 0" class="no-imagenes">
                No hay imágenes en la galería.
            </div>

            <div v-for="img in imagenes" :key="img.id_imagen || img.public_id || img.id" class="card">
                <div class="card-img-wrapper">
                    <img :src="img.url_imagen || img.imagen_referencia || img.url" alt="Imagen" class="card-img" />
                </div>
                <div class="card-body">
                    <h6 class="card-title">{{ img.titulo || 'Sin título' }}</h6>
                    <button class="btn btn-danger btn-sm" @click="eliminarImagen(img.id_imagen)">
                        Eliminar
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            imagenes: [],
            archivo: null,
            titulo: "",
            isUploading: false,
        };
    },
    mounted() {
        this.cargarImagenes();
    },
    methods: {
        async cargarImagenes() {
            try {
                const respuesta = await fetch("http://localhost:4000/api/galeria");
                if (!respuesta.ok) throw new Error("Error al obtener la galería");
                const data = await respuesta.json();
                this.imagenes = data;
            } catch (error) {
                console.error("Error al cargar galería:", error);
                this.imagenes = [];
            }
        },
        seleccionarArchivo(event) {
            this.archivo = event.target.files[0];
        },
        async subirImagen() {
            if (!this.archivo) return alert("Selecciona una imagen primero");
            if (this.isUploading) return;

            this.isUploading = true;
            try {
                const formData = new FormData();
                formData.append("imagen", this.archivo);
                formData.append("titulo", this.titulo);

                const token = localStorage.getItem("token");

                const respuesta = await fetch("http://localhost:4000/api/galeria/upload", {
                    method: "POST",
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                    body: formData,
                });

                if (!respuesta.ok) {
                    const txt = await respuesta.text();
                    throw new Error(txt || "Error al subir imagen");
                }

                this.archivo = null;
                this.titulo = "";
                await this.cargarImagenes();
            } catch (error) {
                console.error("Error al subir imagen:", error);
                alert("No se pudo subir la imagen");
            } finally {
                this.isUploading = false;
            }
        },
        async eliminarImagen(id_imagen) {
            if (!confirm("¿Eliminar esta imagen?")) return;
            try {
                const token = localStorage.getItem("token");
                const respuesta = await fetch(
                    `http://localhost:4000/api/galeria/${encodeURIComponent(id_imagen)}`,
                    {
                        method: "DELETE",
                        headers: token ? { Authorization: `Bearer ${token}` } : {},
                    }
                );

                if (!respuesta.ok) {
                    const txt = await respuesta.text();
                    throw new Error(txt || "Error al eliminar imagen");
                }

                alert("Imagen eliminada");
                this.cargarImagenes();
            } catch (error) {
                console.error("Error al eliminar imagen:", error);
                alert("No se pudo eliminar la imagen");
            }
        },
    },
};
</script>

<style scoped>
.galeria-container {
    max-width: 1200px;
    margin: auto;
    padding: 20px;
}

.services-header {
    text-align: center;
    margin-bottom: 25px;
}

.services-title {
    color: #553a6a;
    font-size: 2rem;
    font-weight: 700;
}

.upload-form {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    justify-content: center;
    margin-bottom: 25px;
}

.input-text,
.input-file {
    padding: 8px;
    border-radius: 8px;
    border: 1px solid #ddd;
}

.btn {
    background-color: #6c63ff;
    color: #fff;
    border: none;
    padding: 8px 14px;
    border-radius: 8px;
    cursor: pointer;
}

.btn:disabled {
    background-color: #aaa;
    cursor: not-allowed;
}

.galeria-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 16px;
}

.no-imagenes {
    text-align: center;
    color: #777;
    grid-column: 1 / -1;
}

.card {
    background: #fff;
    border-radius: 12px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    overflow: hidden;
    display: flex;
    flex-direction: column;
    height: 330px;
    transition: transform 0.2s ease;
}

.card:hover {
    transform: translateY(-5px);
}

.card-img-wrapper {
    height: 200px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
}

.card-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.card-body {
    padding: 12px;
    text-align: center;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.card-title {
    margin: 10px 0;
    font-size: 1rem;
    font-weight: 600;
    color: #553a6a;
}

.btn-danger {
    background-color: #e74c3c;
    border: none;
    color: white;
    padding: 6px 10px;
    border-radius: 8px;
    cursor: pointer;
}

.btn-danger:hover {
    background-color: #c0392b;
}
</style>
