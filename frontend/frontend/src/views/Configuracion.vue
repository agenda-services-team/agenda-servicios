<template>
    <div class="configuracion-container">
        <!-- Cover o rectángulo superior -->
        <div class="profile-cover d-flex align-items-center justify-content-between px-4">
            <h4 class="text-white mb-0">Configuración de perfil</h4>
            <button class="btn btn-light btn-sm">Cambiar portada</button>
        </div>

        <!-- Contenido principal -->
        <div class="container py-4">
            <div class="row">
                <!-- Columna izquierda: perfil básico -->
                <div class="col-md-4 mb-4">
                    <div class="card shadow-sm p-3 text-center">
                        <img src="https://via.placeholder.com/120" alt="Foto de perfil"
                            class="rounded-circle mx-auto mb-3" width="120" height="120" />
                        <h5 class="mb-0">{{ usuario.nombre || 'Nombre del Usuario' }}</h5>
                        <p class="text-muted">{{ usuario.correo || 'correo@ejemplo.com' }}</p>
                        <hr />
                        <p><strong>Teléfono:</strong> {{ usuario.telefono || 'No registrado' }}</p>
                        <button class="btn btn-primary btn-sm w-100 mt-2" @click="editarPerfil">
                            Editar perfil
                        </button>
                    </div>
                </div>

                <!-- Columna derecha: pestañas -->
                <div class="col-md-8">
                    <div class="card shadow-sm p-4">
                        <ul class="nav nav-tabs mb-3" id="configTabs" role="tablist">
                            <li class="nav-item">
                                <button class="nav-link active" id="perfil-tab" data-bs-toggle="tab"
                                    data-bs-target="#perfil" type="button">
                                    Perfil
                                </button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" id="negocio-tab" data-bs-toggle="tab" data-bs-target="#negocio"
                                    type="button">
                                    Negocio
                                </button>
                            </li>
                            <li class="nav-item">
                                <button class="nav-link" id="notificaciones-tab" data-bs-toggle="tab"
                                    data-bs-target="#notificaciones" type="button">
                                    Notificaciones
                                </button>
                            </li>
                        </ul>

                        <div class="tab-content">
                            <!-- Perfil -->
                            <div class="tab-pane fade show active" id="perfil">
                                <h5 class="mb-3">Información personal</h5>
                                <form @submit.prevent="guardarPerfil">
                                    <div class="mb-3">
                                        <label for="nombre" class="form-label">Nombre completo</label>
                                        <input type="text" id="nombre" class="form-control" v-model="usuario.nombre" />
                                    </div>
                                    <div class="mb-3">
                                        <label for="correo" class="form-label">Correo electrónico</label>
                                        <input type="email" id="correo" class="form-control" v-model="usuario.correo" />
                                    </div>
                                    <div class="mb-3">
                                        <label for="telefono" class="form-label">Teléfono</label>
                                        <input type="tel" id="telefono" class="form-control"
                                            v-model="usuario.telefono" />
                                    </div>
                                    <button class="btn btn-primary" type="submit">Guardar cambios</button>
                                </form>
                            </div>

                            <!-- Negocio -->
                            <div class="tab-pane fade" id="negocio">
                                <h5 class="mb-3">Configuración del negocio</h5>
                                <form @submit.prevent="guardarNegocio">
                                    <div class="mb-3">
                                        <label for="nombreNegocio" class="form-label">Nombre del negocio</label>
                                        <input type="text" id="nombreNegocio" class="form-control"
                                            v-model="negocio.nombre" />
                                    </div>
                                    <div class="mb-3">
                                        <label for="horario" class="form-label">Horario laboral</label>
                                        <input type="text" id="horario" class="form-control"
                                            v-model="negocio.horario" />
                                    </div>
                                    <button class="btn btn-primary" type="submit">Guardar configuración</button>
                                </form>
                            </div>

                            <!-- Notificaciones -->
                            <div class="tab-pane fade" id="notificaciones">
                                <h5 class="mb-3">Preferencias de notificación</h5>
                                <form @submit.prevent="guardarNotificaciones">
                                    <div class="form-check form-switch mb-3">
                                        <input class="form-check-input" type="checkbox" id="notifEmail"
                                            v-model="notificaciones.email" />
                                        <label class="form-check-label" for="notifEmail">Recibir notificaciones por
                                            correo</label>
                                    </div>
                                    <div class="form-check form-switch mb-3">
                                        <input class="form-check-input" type="checkbox" id="notifWhatsapp"
                                            v-model="notificaciones.whatsapp" />
                                        <label class="form-check-label" for="notifWhatsapp">Recibir notificaciones por
                                            WhatsApp</label>
                                    </div>
                                    <button class="btn btn-primary" type="submit">Guardar preferencias</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const usuario = ref({
    nombre: "",
    correo: "",
    telefono: ""
});

const negocio = ref({
    nombre: "",
    horario: ""
});

const notificaciones = ref({
    email: true,
    whatsapp: false
});

const guardarPerfil = () => alert("Perfil actualizado");
const guardarNegocio = () => alert("Configuración del negocio guardada");
const guardarNotificaciones = () => alert("Preferencias de notificación guardadas");
const editarPerfil = () => alert("Modo edición activado");
</script>

<style scoped>
.profile-cover {
    background-color: #b5a0ef;
    /* Azul Bootstrap */
    height: 150px;
    border-radius: 10px 10px 0 0;
}

.card {
    border-radius: 12px;
}

img.rounded-circle {
    border: 3px solid #b5a0ef;
}

.btn-primary {
    background-color: #c093cc;
    border-color: #c093cc;
}

.btn-primary:hover {
    background-color: #c093cc;
    border-color: #c093cc;
}

#negocio-tab,
#notificaciones-tab {
    color: #c093cc;
}

#negocio-tab.active,
#notificaciones-tab.active {
    color: #7e57c2;
    border-color: #7e57c2;
}
</style>
