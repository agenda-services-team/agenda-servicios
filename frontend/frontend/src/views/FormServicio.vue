<template>
    <div class="modal-overlay" @click.self="$emit('close')">
        <div class="modal-content">
            <button class="close" aria-label="Cerrar" @click="$emit('close')">×</button>
            <h2>Agregar Servicio</h2>
            <form @submit.prevent="submitForm">
                <label for="prestador">Nombre del prestador:</label>
                <input type="text" id="prestador" v-model="nombrePrestador" required />

                <label for="servicio">Nombre del Servicio:</label>
                <input type="text" id="servicio" v-model="nombreServicio" required />

                <label for="precio">Precio:</label>
                <input type="number" id="precio" v-model="precio" required />

                <label for="descripcion">Descripción</label>
                <input type="text" id="descripcion" v-model="descripcion" required />

                <div class="actions">
                    <button type="button" class="btn-cancel" @click="$emit('close')">Cancelar</button>
                    <button type="submit" class="btn-save">Guardar</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
export default {
    name: 'ServicioForm',
    data() {
        return {
            nombrePrestador: '',
            nombreServicio: '',
            precio: '',
            descripcion: ''
        };
    },
    methods: {
        submitForm() {
            console.log('Servicio agregado:', this.nombrePrestador, this.nombreServicio, this.precio, this.descripcion);
            this.$emit('close');
        }
    }
};
</script>

<style scoped>
.modal-overlay {
    position: fixed;
    inset: 0;
    /* top:0; right:0; bottom:0; left:0 */
    background: rgba(0, 0, 0, 0.45);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}

.modal-content {
    background-color: #fff;
    padding: 24px;
    border-radius: 12px;
    width: 420px;
    max-width: calc(100% - 48px);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
    position: relative;
}

.close {
    position: absolute;
    top: 10px;
    right: 12px;
    border: none;
    background: transparent;
    font-size: 22px;
    cursor: pointer;
}

form label {
    display: block;
    margin-top: 12px;
    font-weight: 600;
}

form input {
    width: 100%;
    padding: 8px 10px;
    margin-top: 6px;
    border-radius: 8px;
    border: 1px solid #ddd;
}

.actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 16px;
}

.btn-cancel {
    background: #f3f3f3;
    border: 1px solid #ddd;
    padding: 8px 12px;
    border-radius: 8px;
}

.btn-save {
    background: #6c63ff;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 8px;
}
</style>
