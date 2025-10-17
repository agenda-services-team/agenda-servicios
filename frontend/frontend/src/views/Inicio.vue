<template>
    <div class="inicio-container">
        <div class="cards-row">
            <div class="dashboard-card card-color1">
                <h5 class="card-title">Citas Agendadas</h5>
                <p class="card-text">5 citas esta semana</p>
            </div>
            <div class="dashboard-card card-color1">
                <h5 class="card-title">Nuevos Clientes</h5>
                <p class="card-text">3 clientes nuevos</p>
            </div>
        </div>

        <div class="bottom-row">
            <div class="dashboard-summary">
                <h5>Resumen de Actividad de la Semana</h5>
                <p>Aquí se mostrarán los detalles de tus citas y progreso semanal.</p>
            </div>
            <div class="dashboard-side">
                <button class="btn-custom" @click="toggleForm">Añadir Nuevo Servicio</button>

                <div class="upcoming-appointments">
                    <h6>Próximas Citas</h6>
                    <ul>
                        <li>10/10 - Cliente A</li>
                        <li>11/10 - Cliente B</li>
                        <li>12/10 - Cliente C</li>
                    </ul>
                </div>
            </div>
        </div>
        <ServicioForm v-if="showForm" @close="showForm = false" />
    </div>
</template>

<script setup>
import { ref } from 'vue';
import ServicioForm from './FormServicio.vue';
const showForm = ref(false)
function toggleForm() {
    showForm.value = !showForm.value
}
</script>

<style scoped>
.inicio-container {
    max-width: 900px;
    margin: 0 auto;
    padding: 2rem 0;
    font-family: 'Montserrat', Arial, sans-serif;
    color: #3b2f5c;
}

/* Fila superior con tarjetas */
.cards-row {
    display: flex;
    gap: 24px;
    margin-bottom: 32px;
}

/* Tarjetas principales */
.dashboard-card {
    flex: 1;
    background: #b5a0ef;
    color: white;
    border-radius: 18px;
    padding: 32px;
    box-shadow: 0 6px 24px rgba(180, 153, 204, 0.15);
    text-align: center;
    font-weight: 500;
    font-size: 1.1rem;
}

.card-color1 {
    background: #b5a0ef;
}

.card-title {
    font-size: 1.25rem;
    margin-bottom: 0.8em;
}

.card-text {
    font-size: 1rem;
}

.bottom-row {
    display: flex;
    gap: 32px;
    align-items: flex-start;
}

/* Resumen de actividad */
.dashboard-summary {
    flex: 2;
    background: #f6fbfb;
    border-radius: 18px;
    padding: 32px;
    box-shadow: 0 4px 16px rgba(180, 153, 204, 0.09);
    color: #553a6a;
    min-width: 0;
}

/* Lado derecho: botón y próximas citas */
.dashboard-side {
    flex: 1;
    background: #fce9ee;
    border-radius: 18px;
    padding: 32px;
    box-shadow: 0 4px 16px rgba(180, 153, 204, 0.09);
    color: #791236;
}

.btn-custom {
    background: #c093cc;
    border: none;
    color: white;
    font-weight: 600;
    width: 100%;
    padding: 14px;
    margin-bottom: 1rem;
    border-radius: 12px;
    font-size: 1rem;
    cursor: pointer;
    box-shadow: 0 2px 8px rgba(180, 153, 204, 0.18);
    transition: background-color 0.2s;
}

.btn-custom:hover {
    background: #ad84bb;
}

.upcoming-appointments h6 {
    margin-bottom: 1rem;
    font-weight: 600;
}

.upcoming-appointments ul {
    list-style: none;
    padding-left: 0;
}

.upcoming-appointments li {
    padding: 6px 0;
    border-bottom: 1px solid #d4c2df;
}
</style>
