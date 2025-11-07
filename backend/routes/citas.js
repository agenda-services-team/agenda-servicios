import express from "express";
import { supabase } from "../config/supabaseClient.js";
import { autenticar } from "../middleware/auth.js";

const router = express.Router();

// Crear una cita (CLIENTE)
router.post("/", autenticar, async (req, res) => {
    try {
        const { id_servicio, fecha, hora, notas } = req.body;
        const id_cliente = req.usuario.id_usuario;

        if (!id_servicio || !fecha || !hora)
            return res.status(400).send("Todos los campos son obligatorios");

        const fechaHoy = new Date();
        const fechaCita = new Date(`${fecha} ${hora}`);
        if (fechaCita < fechaHoy)
            return res.status(400).send("No puedes reservar en una fecha pasada");

        const horaNum = parseInt(hora.split(":")[0]);
        if (horaNum < 8 || horaNum > 20)
            return res.status(400).send("Horario fuera del rango permitido (08:00-20:00)");

        const { data: citasExistentes, error: errorSelect } = await supabase
            .from("citas")
            .select("*")
            .eq("id_servicio", id_servicio)
            .eq("fecha_cita", fecha)
            .eq("hora_cita", hora);

        if (errorSelect) throw errorSelect;

        if (citasExistentes.length > 0)
            return res.status(400).send("Ese horario ya está reservado");

        const { data, error } = await supabase
            .from("citas")
            .insert([{ 
                id_cliente, 
                id_servicio, 
                fecha_cita: fecha,
                hora_cita: hora,
                notas: notas || null,
                estado: "pendiente",
                fecha_reserva: new Date()
            }])
            .select();

        if (error) throw error;

        res.json(data[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al crear cita");
    }
});

// ✅ NUEVO: Obtener citas del proveedor
router.get("/proveedor", autenticar, async (req, res) => {
    try {
        const id_proveedor = req.usuario.id_usuario;

        console.log("📋 Buscando citas para proveedor:", id_proveedor);

        // Paso 1: Obtener emprendimiento del proveedor
        const { data: emprendimiento, error: errorEmp } = await supabase
            .from("emprendimientos")
            .select("id_emprendimiento")
            .eq("id_proveedor", id_proveedor)
            .single();

        if (errorEmp || !emprendimiento) {
            console.log("⚠️ No se encontró emprendimiento");
            return res.json([]);
        }

        const id_emprendimiento = emprendimiento.id_emprendimiento;
        console.log("✅ Emprendimiento encontrado:", id_emprendimiento);

        // Paso 2: Obtener servicios del emprendimiento
        const { data: servicios, error: errorServ } = await supabase
            .from("servicios")
            .select("id_servicio, nombre_servicio, duracion, precio")
            .eq("id_emprendimiento", id_emprendimiento);

        if (errorServ) throw errorServ;

        const idsServicios = servicios.map(s => s.id_servicio);

        if (idsServicios.length === 0) {
            console.log("⚠️ No hay servicios");
            return res.json([]);
        }

        console.log("✅ Servicios encontrados:", idsServicios);

        // Paso 3: Obtener citas de esos servicios
        const { data: citas, error: errorCitas } = await supabase
            .from("citas")
            .select("*")
            .in("id_servicio", idsServicios)
            .order("fecha_cita", { ascending: true })
            .order("hora_cita", { ascending: true });

        if (errorCitas) throw errorCitas;

        console.log("✅ Citas encontradas:", citas.length);

        // Paso 4: Obtener datos de clientes
        const idsClientes = [...new Set(citas.map(c => c.id_cliente))];
        
        const { data: clientes, error: errorClientes } = await supabase
            .from("usuarios")
            .select("id_usuario, nombre, correo, telefono")
            .in("id_usuario", idsClientes);

        if (errorClientes) throw errorClientes;

        // Paso 5: Formatear para FullCalendar
        const citasFormateadas = citas.map(c => {
            const servicio = servicios.find(s => s.id_servicio === c.id_servicio);
            const cliente = clientes.find(cl => cl.id_usuario === c.id_cliente);

            return {
                id: c.id_cita,
                servicio: servicio?.nombre_servicio || "Sin servicio",
                fechaHoraInicio: `${c.fecha_cita}T${c.hora_cita}`,
                fechaHoraFin: calcularHoraFin(c.fecha_cita, c.hora_cita, servicio?.duracion || 60),
                estado: c.estado,
                cliente: cliente?.nombre || "Sin nombre",
                empleado: "Por asignar",
                precio: servicio?.precio || 0,
                duracion: servicio?.duracion || 0,
                notas: c.notas,
                telefono: cliente?.telefono,
                correo: cliente?.correo
            };
        });

        res.json(citasFormateadas);

    } catch (err) {
        console.error("❌ Error al obtener citas del proveedor:", err.message);
        res.status(500).send("Error al obtener citas");
    }
});

// Función auxiliar para calcular hora de fin
function calcularHoraFin(fecha, horaInicio, duracionMinutos) {
    const [horas, minutos] = horaInicio.split(':').map(Number);
    const fechaHora = new Date(`${fecha}T${horaInicio}`);
    fechaHora.setMinutes(fechaHora.getMinutes() + duracionMinutos);
    
    const horaFin = fechaHora.toTimeString().slice(0, 5);
    return `${fecha}T${horaFin}`;
}

// Listar todas las citas (CLIENTE)
router.get("/", autenticar, async (req, res) => {
    try {
        const id_cliente = req.usuario.id_usuario;

        const { data, error } = await supabase
            .from("citas")
            .select(`
                *,
                servicios (
                    id_servicio,
                    nombre_servicio,
                    descripcion,
                    precio,
                    duracion,
                    emprendimientos (
                        nombre_negocio,
                        domicilio
                    )
                )
            `)
            .eq("id_cliente", id_cliente)
            .order("fecha_cita", { ascending: true })
            .order("hora_cita", { ascending: true });

        if (error) throw error;

        const citas = data.map(c => ({
            id_cita: c.id_cita,
            fecha: c.fecha_cita,
            hora: c.hora_cita,
            estado: c.estado,
            notas: c.notas,
            servicio: c.servicios?.nombre_servicio,
            descripcion: c.servicios?.descripcion,
            precio: c.servicios?.precio,
            duracion: c.servicios?.duracion,
            emprendimiento: c.servicios?.emprendimientos?.nombre_negocio,
            direccion: c.servicios?.emprendimientos?.domicilio
        }));

        res.json(citas);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al obtener citas");
    }
});

// Obtener cita por ID
router.get("/:id", autenticar, async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("citas")
            .select("*, usuarios(id_usuario, nombre, correo), servicios(id_servicio, nombre_servicio, descripcion, precio)")
            .eq("id_cita", id)
            .single();

        if (error || !data) return res.status(404).send("Cita no encontrada");

        const cita = {
            ...data,
            cliente: data.usuarios?.nombre,
            correo: data.usuarios?.correo,
            servicio: data.servicios?.nombre_servicio,
            precio: data.servicios?.precio,
            descripcion: data.servicios?.descripcion
        };

        res.json(cita);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al obtener cita");
    }
});

// Actualizar cita
router.put("/:id", autenticar, async (req, res) => {
    try {
        const { id } = req.params;
        const { fecha, hora } = req.body;

        if (!fecha || !hora)
            return res.status(400).send("Todos los campos son obligatorios");

        const fechaHoy = new Date();
        const fechaCita = new Date(`${fecha} ${hora}`);
        if (fechaCita < fechaHoy)
            return res.status(400).send("No puedes reservar en una fecha pasada");

        const horaNum = parseInt(hora.split(":")[0]);
        if (horaNum < 8 || horaNum > 20)
            return res.status(400).send("Horario fuera del rango permitido (08:00-20:00)");

        const { data: citasExistentes, error: errorSelect } = await supabase
            .from("citas")
            .select("*")
            .neq("id_cita", id)
            .eq("fecha_cita", fecha)
            .eq("hora_cita", hora);

        if (errorSelect) throw errorSelect;

        if (citasExistentes.length > 0)
            return res.status(400).send("Ese horario ya está ocupado");

        const { data, error } = await supabase
            .from("citas")
            .update({ 
                fecha_cita: fecha,
                hora_cita: hora
            })
            .eq("id_cita", id)
            .select();

        if (error || !data.length) return res.status(404).send("Cita no encontrada");

        res.json(data[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al actualizar cita");
    }
});

// Eliminar cita
router.delete("/:id", autenticar, async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("citas")
            .delete()
            .eq("id_cita", id)
            .select();

        if (error || !data.length) return res.status(404).send("Cita no encontrada");

        res.json({ mensaje: "Cita eliminada", cita: data[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al eliminar cita");
    }
});

export default router;
