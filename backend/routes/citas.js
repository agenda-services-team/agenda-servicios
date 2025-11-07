import express from "express";
import { supabase } from "../config/supabaseClient.js";
import { autenticar } from "../middleware/auth.js";

const router = express.Router();

// Crear una cita
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

        // Validar que no exista otra cita en el mismo servicio, fecha y hora
        const { data: citasExistentes, error: errorSelect } = await supabase
            .from("citas")
            .select("*")
            .eq("id_servicio", id_servicio)
            .eq("fecha_cita", fecha)  // ✅ CAMBIO 1: fecha → fecha_cita
            .eq("hora_cita", hora);   // ✅ CAMBIO 2: hora → hora_cita

        if (errorSelect) throw errorSelect;

        if (citasExistentes.length > 0)
            return res.status(400).send("Ese horario ya está reservado");

        const { data, error } = await supabase
            .from("citas")
            .insert([{ 
                id_cliente, 
                id_servicio, 
                fecha_cita: fecha,        // ✅ CAMBIO 3: fecha → fecha_cita
                hora_cita: hora,          // ✅ CAMBIO 4: hora → hora_cita
                notas: notas || null,
                estado: "pendiente",      // ✅ CAMBIO 5: "activa" → "pendiente" (según schema)
                fecha_reserva: new Date() // ✅ CAMBIO 6: creado_en → fecha_reserva
            }])
            .select();

        if (error) throw error;

        res.json(data[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al crear cita");
    }
});

// Listar todas las citas
router.get("/", autenticar, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("citas")
            .select("*, usuarios(id_usuario, nombre, correo), servicios(id_servicio, nombre_servicio, descripcion, precio)")
            .order("fecha_cita", { ascending: true })  // ✅ fecha → fecha_cita
            .order("hora_cita", { ascending: true });  // ✅ hora → hora_cita

        if (error) throw error;

        const citas = data.map(c => ({
            ...c,
            cliente: c.usuarios?.nombre,
            correo: c.usuarios?.correo,
            servicio: c.servicios?.nombre_servicio, // ✅ nombre → nombre_servicio
            precio: c.servicios?.precio,
            descripcion: c.servicios?.descripcion
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
            servicio: data.servicios?.nombre_servicio, // ✅ nombre → nombre_servicio
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
            .eq("fecha_cita", fecha)  // ✅ fecha → fecha_cita
            .eq("hora_cita", hora);   // ✅ hora → hora_cita

        if (errorSelect) throw errorSelect;

        if (citasExistentes.length > 0)
            return res.status(400).send("Ese horario ya está ocupado");

        const { data, error } = await supabase
            .from("citas")
            .update({ 
                fecha_cita: fecha,  // ✅ fecha → fecha_cita
                hora_cita: hora     // ✅ hora → hora_cita
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
