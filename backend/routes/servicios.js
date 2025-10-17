import express from "express";
import { supabase } from "../config/supabaseClient.js";
import { autenticar } from "../middleware/auth.js";

const router = express.Router();

// Crear servicio (solo usuarios autenticados)
router.post("/", autenticar, async (req, res) => {
    try {
        const { nombre, descripcion, precio } = req.body;
        const id_prestador = req.usuario.id_usuario;

        if (!nombre || !descripcion || precio == null)
            return res.status(400).send("Todos los campos son obligatorios");

        if (precio < 0)
            return res.status(400).send("El precio debe ser un valor positivo");

        const { data, error } = await supabase
            .from("servicios")
            .insert([{ id_prestador, nombre, descripcion, precio }])
            .select();

        if (error) throw error;

        res.json(data[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al crear servicio");
    }
});

// Listar todos los servicios
router.get("/", autenticar, async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("servicios")
            .select("*, usuarios(id_usuario, nombre)")
            .order("id_servicio", { ascending: true });

        if (error) throw error;

        // Combinar prestador_nombre
        const servicios = data.map(s => ({
            ...s,
            prestador_nombre: s.usuarios?.nombre
        }));

        res.json(servicios);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al obtener servicios");
    }
});

// Obtener un servicio por ID
router.get("/:id", autenticar, async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("servicios")
            .select("*, usuarios(id_usuario, nombre)")
            .eq("id_servicio", id)
            .single();

        if (error) return res.status(404).send("Servicio no encontrado");

        const servicio = { ...data, prestador_nombre: data.usuarios?.nombre };
        res.json(servicio);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al obtener servicio");
    }
});

// Actualizar servicio (solo el proovedor)
router.put("/:id", autenticar, async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio } = req.body;
        const id_prestador = req.usuario.id_usuario;

        if (!nombre || !descripcion || precio == null)
            return res.status(400).send("Todos los campos son obligatorios");

        if (precio < 0)
            return res.status(400).send("El precio debe ser un valor positivo");

        // Verificar propietario
        const { data: servicio, error } = await supabase
            .from("servicios")
            .select("*")
            .eq("id_servicio", id)
            .eq("id_prestador", id_prestador)
            .single();

        if (!servicio) return res.status(403).send("No puedes actualizar este servicio");
        if (error) throw error;

        const { data, error: updateError } = await supabase
            .from("servicios")
            .update({ nombre, descripcion, precio })
            .eq("id_servicio", id)
            .select();

        if (updateError) throw updateError;

        res.json(data[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al actualizar servicio");
    }
});

// Eliminar servicio (solo el prestador)
router.delete("/:id", autenticar, async (req, res) => {
    try {
        const { id } = req.params;
        const id_prestador = req.usuario.id_usuario;

        // Verificar propietario
        const { data: servicio, error } = await supabase
            .from("servicios")
            .select("*")
            .eq("id_servicio", id)
            .eq("id_prestador", id_prestador)
            .single();

        if (!servicio) return res.status(403).send("No puedes eliminar este servicio");
        if (error) throw error;

        const { data, error: deleteError } = await supabase
            .from("servicios")
            .delete()
            .eq("id_servicio", id)
            .select();

        if (deleteError) throw deleteError;

        res.json({ mensaje: "Servicio eliminado", servicio: data[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al eliminar servicio");
    }
});

export default router;
