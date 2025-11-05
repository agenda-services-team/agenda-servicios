<template>
    <div class="agenda-container">
        <div class="agenda-header">
            <h1 class="agenda-title">Agenda de Citas</h1>
            <button class="btn-agendar-cita">
                + Agendar Nueva Cita
            </button>
        </div>

        <div class="agenda-content-wrapper">
            <div class="calendar-wrapper">
                <div class="calendar-controls">
                    <div class="date-navigator">
                        <button @click="navigateCalendar('prev')" class="nav-button">&lt;</button>
                        <span class="current-week">{{ currentWeekDisplay }}</span>
                        <button @click="navigateCalendar('next')" class="nav-button">&gt;</button>
                    </div>
                    <div class="view-switcher">
                        <button @click="changeView('dayGridMonth')"
                            :class="{ 'active': currentView === 'dayGridMonth' }" class="view-button">Mes</button>
                        <button @click="changeView('timeGridWeek')"
                            :class="{ 'active': currentView === 'timeGridWeek' }" class="view-button">Semana</button>
                    </div>
                </div>

                <FullCalendar ref="fullCalendar" :options="calendarOptions" />
            </div>

            <div class="filter-sidebar">
                <h3 class="filter-title">Filtros</h3>

                <label class="filter-label">Empleado</label>
                <select v-model="selectedEmpleado" @change="applyFilters" class="filter-select">
                    <option value="todos">Todos</option>
                    <option value="Laura G.">Laura G.</option>
                    <option value="María P.">María P.</option>
                </select>

                <label class="filter-label">Estado de la Cita</label>
                <select v-model="selectedEstado" @change="applyFilters" class="filter-select">
                    <option value="todos">Todos</option>
                    <option value="confirmado">Confirmadas</option>
                    <option value="pendiente">Pendientes</option>
                    <option value="cancelado">Canceladas</option>
                </select>
            </div>
        </div>
    </div>
</template>
<script>
import FullCalendar from '@fullcalendar/vue3'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import esLocale from '@fullcalendar/core/locales/es';

export default {
    components: { FullCalendar },
    data() {
        return {
            calendarApi: null,
            currentView: 'timeGridWeek',
            currentWeekDisplay: 'Cargando...',
            selectedEmpleado: 'todos',
            selectedEstado: 'todos',
            allCitas: [], // Almacenará todas las citas cargadas
            calendarOptions: {
                plugins: [dayGridPlugin, timeGridPlugin, interactionPlugin],
                initialView: 'timeGridWeek',
                locales: [esLocale],
                locale: 'es',
                headerToolbar: false,
                slotMinTime: '08:00:00', // Horario de inicio 
                slotMaxTime: '20:00:00', // Horario de fin
                events: [],
                eventClick: this.handleEventClick,
                datesSet: this.handleDatesSet,
                eventContent: this.renderEventContent
            }
        };
    },
    mounted() {
        this.cargarCitas()
    },
    methods: {
        cargarCitas() {
            // ejemplo de un array de citas
            const dummyData = [
                { id: 1, servicio: 'Corte de Pelo', fechaHoraInicio: '2025-10-08T10:00:00', fechaHoraFin: '2025-10-08T11:00:00', estado: 'confirmado', cliente: 'Maria R.', empleado: 'Laura G.' },
                { id: 2, servicio: 'Manicura', fechaHoraInicio: '2025-10-08T11:30:00', fechaHoraFin: '2025-10-08T12:30:00', estado: 'pendiente', cliente: 'Juana T.', empleado: 'María P.' },
                { id: 3, servicio: 'Tinte Completo', fechaHoraInicio: '2025-10-09T14:00:00', fechaHoraFin: '2025-10-09T16:00:00', estado: 'confirmado', cliente: 'Ana P.', empleado: 'Laura G.' },
            ];

            const eventos = dummyData.map(cita => ({
                id: cita.id,
                // Combina cliente y servicio para el título
                title: `${cita.cliente} \n ${cita.servicio}`,
                start: cita.fechaHoraInicio,
                end: cita.fechaHoraFin,
                // Usamos la propiedad 'color' para el fondo del evento
                color: this.getEventColor(cita.estado),
                extendedProps: {
                    estado: cita.estado,
                    cliente: cita.cliente,
                    empleado: cita.empleado
                }
            }))

            this.allCitas = eventos; // Guardamos todas las citas
            this.calendarOptions.events = eventos; // Inicialmente mostramos todas
            this.calendarApi = this.$refs.fullCalendar.getApi();
        },
        // --- Lógica de FullCalendar ---
        handleDatesSet(info) {
            // Actualiza el texto de "Semana del..."
            const start = new Date(info.start);
            const end = new Date(info.end);
            end.setDate(end.getDate() - 1); // Resta un día para que sea el final de la semana
            const fmt = (date) => date.toLocaleDateString('es', { day: 'numeric', month: 'short' }).replace('.', '');

            this.currentWeekDisplay = `Semana del ${fmt(start)} - ${fmt(end)}, ${start.getFullYear()}`;
        },
        navigateCalendar(direction) {
            if (this.calendarApi) {
                direction === 'prev' ? this.calendarApi.prev() : this.calendarApi.next();
            }
        },
        changeView(view) {
            if (this.calendarApi) {
                this.calendarApi.changeView(view);
                this.currentView = view;
            }
        },
        renderEventContent(arg) {
            // Esto permite que el contenido del evento se vea con saltos de línea (\n)
            return { html: `<div class="event-content">${arg.event.title.replace('\n', '<br>')}</div>` };
        },
        getEventColor(estado) {
            switch (estado) {
                case 'confirmado': return '#791236'; // Morado oscuro de la app
                case 'pendiente': return '#F1C40F'; // Amarillo
                case 'cancelado': return '#E74C3C'; // Rojo
                default: return '#791236';
            }
        },

        // --- Lógica de Filtros ---
        applyFilters() {
            let filteredEvents = this.allCitas;

            // Filtrar por Empleado
            if (this.selectedEmpleado !== 'todos') {
                filteredEvents = filteredEvents.filter(cita => cita.extendedProps.empleado === this.selectedEmpleado);
            }

            // Filtrar por Estado
            if (this.selectedEstado !== 'todos') {
                filteredEvents = filteredEvents.filter(cita => cita.extendedProps.estado === this.selectedEstado);
            }

            this.calendarOptions = {
                ...this.calendarOptions,
                events: filteredEvents
            }
        },
        handleEventClick(info) {
            alert(`Cita: ${info.event.extendedProps.cliente} - ${info.event.extendedProps.empleado}\nServicio: ${info.event.title.split('\n')[1].trim()}\nEstado: ${info.event.extendedProps.estado}`)
        }
    }
}
</script>

<style scoped>
.agenda-container {
    padding: 10px 0;
}

.agenda-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 30px;
}

.agenda-title {
    color: #553a6a;
    font-size: 1.8rem;
    font-weight: 700;
}

.btn-agendar-cita {
    background-color: #791236;
    color: white;
    padding: 12px 25px;
    border: none;
    border-radius: 12px;
    font-weight: 600;
    cursor: pointer;
    box-shadow: 0 4px 10px rgba(121, 18, 54, 0.2);
    transition: background-color 0.2s;
}

.btn-agendar-cita:hover {
    background-color: #5e0f2b;
}

.agenda-content-wrapper {
    display: flex;
    gap: 30px;
}

.calendar-wrapper {
    flex: 3;
    /* Ocupa la mayor parte del espacio */
    min-width: 0;
}

/* --- Estilos de Controles de Calendario --- */
.calendar-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.date-navigator {
    display: flex;
    align-items: center;
    gap: 15px;
}

.current-week {
    font-size: 1.1rem;
    font-weight: 600;
    color: #553a6a;
}

.nav-button {
    background: none;
    border: 1px solid #ccc;
    color: #553a6a;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.2s;
}

.nav-button:hover {
    background: #f0f0f0;
}

.view-switcher .view-button {
    background: #f0f0f0;
    color: #553a6a;
    border: none;
    padding: 8px 15px;
    border-radius: 8px;
    margin-left: 8px;
    font-weight: 500;
    cursor: pointer;
}

.view-switcher .view-button.active {
    background: #791236;
    color: white;
    box-shadow: 0 2px 5px rgba(121, 18, 54, 0.3);
}

/* --- Estilos de Filtros --- */
.filter-sidebar {
    flex: 1;
    /* Ocupa el espacio restante */
    background-color: #F8F8FC;
    /* Fondo para el panel de filtros */
    padding: 20px;
    border-radius: 15px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.03);
}

.filter-title {
    font-size: 1.2rem;
    font-weight: 600;
    color: #553a6a;
    margin-bottom: 20px;
    border-bottom: 1px solid #e0d5e8;
    padding-bottom: 10px;
}

.filter-label {
    display: block;
    font-weight: 500;
    color: #553a6a;
    margin-top: 15px;
    margin-bottom: 5px;
    font-size: 0.95rem;
}

.filter-select {
    width: 100%;
    padding: 10px;
    border-radius: 8px;
    border: 1px solid #d4c2df;
    background-color: white;
    color: #553a6a;
    cursor: pointer;
}

/* --- Estilos para FullCalendar --- */
/* Personaliza el look de la parrilla de tiempo */
.fc-timegrid-slots table {
    border: 1px solid #e0d5e8;
    border-radius: 10px;
}

/* Estilo para los bloques de cita (eventos) */
.fc .fc-timegrid-event {
    border-radius: 8px;
    padding: 5px;
    font-weight: 500;
}

/* Contenido interno del evento para multilínea */
.event-content {
    line-height: 1.2;
    font-size: 0.9rem;
    white-space: pre-wrap;
}

/* Estilo de las cabeceras de los días */
.fc-daygrid-day-header,
.fc-timegrid-slot-label,
.fc-timegrid-axis {
    color: #553a6a;
    font-weight: 500;
}

/* Asegurar que las horas no sean demasiado grandes */
.fc-timegrid-slot-label {
    font-size: 0.8rem;
}
</style>