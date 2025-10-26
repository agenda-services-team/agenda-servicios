import express from "express";
import { supabase } from "../config/supabaseClient.js";
import { autenticar } from "../middleware/auth.js";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";


const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(file.originalname.toLowerCase().split('.').pop());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error("Solo se permiten imágenes JPEG o PNG"));
        }
    }
});

const router = express.Router();

//feat: Alex
// Obtener TODOS los servicios para clientes (sin filtro por emprendimiento)
router.get("/public/todos", async (req, res) => {
    try {
        console.log('🔍 Ejecutando /public/todos');
        
        const { data, error } = await supabase
            .from("servicios")
            .select(`
                *,
                emprendimientos (
                    id_emprendimiento,
                    nombre_negocio,
                    usuarios (
                        id_usuario,
                        nombre
                    )
                )
            `)
            .order("id_servicio", { ascending: true });

        if (error) {
            console.error('❌ Error Supabase:', error);
            throw error;
        }

        console.log(`✅ Servicios encontrados: ${data?.length || 0}`);

        const servicios = data.map((s) => ({
            id_servicio: s.id_servicio,
            nombre: s.nombre_servicio,
            descripcion: s.descripcion,
            precio: s.precio,
            duracion: s.duracion,
            imagen_referencia: s.imagen_referencia,
            nombre_emprendimiento: s.emprendimientos?.nombre_negocio || "Sin nombre",
            id_proveedor: s.emprendimientos?.usuarios?.id_usuario,
            nombre_proveedor: s.emprendimientos?.usuarios?.nombre || "Desconocido"
            // ELIMINAR email_proveedor ya que no existe
        }));

        res.json(servicios);
    } catch (error) {
        console.error("💥 Error al obtener servicios públicos:", error.message);
        res.status(500).send("Error al obtener servicios: " + error.message);
    }
});

// Obtener servicios públicos con autenticación opcional
router.get("/public/cliente", async (req, res) => { // ← QUITAR autenticar
    try {
        console.log('🔍 Ejecutando /public/cliente');
        
        const { data, error } = await supabase
            .from("servicios")
            .select(`
                *,
                emprendimientos (
                    id_emprendimiento,
                    nombre_negocio,
                    descripcion,
                    usuarios (
                        id_usuario,
                        nombre
                    )
                )
            `)
            .order("id_servicio", { ascending: true });

        if (error) {
            console.error('❌ Error Supabase:', error);
            throw error;
        }

        console.log(`✅ Servicios encontrados: ${data?.length || 0}`);

        const servicios = data.map((s) => ({
            id_servicio: s.id_servicio,
            nombre: s.nombre_servicio,
            descripcion: s.descripcion,
            precio: s.precio,
            duracion: s.duracion,
            imagen_referencia: s.imagen_referencia,
            id_emprendimiento: s.id_emprendimiento,
            nombre_emprendimiento: s.emprendimientos?.nombre_negocio || "Sin nombre",
            descripcion_emprendimiento: s.emprendimientos?.descripcion,
            id_proveedor: s.emprendimientos?.usuarios?.id_usuario,
            nombre_proveedor: s.emprendimientos?.usuarios?.nombre || "Desconocido"
        }));

        res.json(servicios);
    } catch (error) {
        console.error("💥 Error al obtener servicios para cliente:", error.message);
        res.status(500).send("Error al obtener servicios: " + error.message);
    }
});

// Obtener servicios del proveedor logeado
router.get("/proveedor/mis-servicios", autenticar, async (req, res) => {
    try {
        console.log('🔍 Ejecutando /proveedor/mis-servicios para usuario:', req.usuario.id_usuario);
        
        const { data, error } = await supabase
            .from("servicios")
            .select(`
                *,
                emprendimientos (
                    id_emprendimiento,
                    nombre_negocio,
                    usuarios (
                        id_usuario,
                        nombre
                    )
                )
            `)
            .eq('id_emprendimiento', req.usuario.id_emprendimiento)
            .order("id_servicio", { ascending: true });

        if (error) {
            console.error('❌ Error Supabase:', error);
            throw error;
        }

        console.log(`✅ Servicios del proveedor: ${data?.length || 0}`);

        const servicios = data.map((s) => ({
            id_servicio: s.id_servicio,
            id_emprendimiento: s.id_emprendimiento,
            nombre: s.nombre_servicio,
            descripcion: s.descripcion,
            precio: s.precio,
            duracion: s.duracion,
            nombre_emprendimiento: s.emprendimientos?.nombre_negocio || "Sin nombre",
            id_usuario: s.emprendimientos?.usuarios?.id_usuario || null,
            nombre_proveedor: s.emprendimientos?.usuarios?.nombre || "Desconocido",
            imagen_referencia: s.imagen_referencia
        }));

        res.json(servicios);
    } catch (error) {
        console.error("💥 Error al obtener servicios del proveedor:", error.message);
        res.status(500).send("Error al obtener servicios: " + error.message);
    }
});
//fin del feat : alex

// Obtener todos los servicios
router.get("/", autenticar, async (req, res) => {
    try {

        const { data, error } = await supabase
            .from("servicios")
            .select(`
                *,
                emprendimientos (
                id_emprendimiento,
                nombre_negocio,
                usuarios (
                    id_usuario,
                    nombre
                )
            )
        `)
            .eq('id_emprendimiento', req.usuario.id_emprendimiento)
            .order("id_servicio", { ascending: true });

        if (error) throw error;

        const servicios = data.map((s) => ({
            id_servicio: s.id_servicio,
            id_emprendimiento: s.id_emprendimiento,
            nombre: s.nombre_servicio,
            descripcion: s.descripcion,
            precio: s.precio,
            duracion: s.duracion,
            nombre_emprendimiento: s.emprendimientos?.nombre_negocio || "Sin nombre",
            id_usuario: s.emprendimientos?.usuarios?.id_usuario || null,
            nombre_proveedor: s.emprendimientos?.usuarios?.nombre || "Desconocido",
            imagen_referencia: s.imagen_referencia
        }));

        res.json(servicios);
    } catch (error) {
        console.error("Error al obtener servicios:", error.message);
        res.status(500).send("Error al obtener servicios");
    }
});

// Obtener servicio por ID
router.get("/:id", autenticar, async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("servicios")
            .select("*, usuarios(id_usuario, nombre)")
            .eq("id_servicio", id)
            .single();

        if (error || !data) {
            return res.status(404).send("Servicio no encontrado");
        }

        const servicio = {
            id_servicio: data.id_servicio,
            nombre: data.nombre_servicio,
            descripcion: data.descripcion,
            precio: data.precio,
            duracion: data.duracion,
            id_prestador: data.id_prestador,
            prestador_nombre: data.usuarios?.nombre || "Desconocido",
            imagen_referencia: data.imagen_referencia
        };

        res.json(servicio);
    } catch (error) {
        console.error("Error al obtener servicio por ID:", error.message);
        res.status(500).send("Error al obtener servicio por ID");
    }
});

// Actualizar servicio
router.put("/:id", autenticar, upload.single(" imagen"), async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio, duracion } = req.body;
        const id_prestador = req.usuario.id_usuario;
        let imagen_referencia = null;

        if (!nombre || !descripcion || precio == null || !duracion) {
            return res.status(400).send("Todos los campos son obligatorios");
        }

        if (precio < 0) {
            return res.status(400).send("El precio debe ser un valor positivo");
        }

        // Verificar si el servicio pertenece al usuario
        const { data: servicioExistente, error: fetchError } = await supabase
            .from("servicios")
            .select("*")
            .eq("id_servicio", id)
            .eq("id_prestador", id_prestador)
            .single();

        if (fetchError || !servicioExistente) {
            return res.status(403).send("No puedes actualizar este servicio");
        }

        // Subir nueva imagen a Cloudinary si se proporcionó
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "servicios" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });

            imagen_referencia = result.secure_url;
        }

        // Actualizar servicio
        const updateData = {
            nombre: nombre || servicioExistente.nombre,
            descripcion: descripcion || servicioExistente.descripcion,
            precio: parseFloat(precio) || servicioExistente.precio,
            duracion: duracion || servicioExistente.duracion
        };

        if (imagen_referencia) {
            updateData.imagen_referencia = imagen_referencia;
        }

        const { data, error } = await supabase
            .from("servicios")
            .update(updateData)
            .eq("id_servicio", id)
            .select();

        if (error) throw error;

        res.json({
            mensaje: "Servicio actualizado con éxito",
            servicio: data[0]
        });
    } catch (error) {
        console.error("Error al actualizar servicio:", error.message);
        res.status(500).send("Error al actualizar servicio");
    }
});

// Eliminar servicio
router.delete("/:id", autenticar, async (req, res) => {
    try {
        const { id } = req.params;
        const id_emprendimiento = req.usuario.id_emprendimiento;

        // Verificar si el servicio pertenece al emprendimiento del usuario autenticado
        const { data: servicioExistente, error: fetchError } = await supabase
            .from("servicios")
            .select("*")
            .eq("id_servicio", id)
            .eq("id_emprendimiento", id_emprendimiento)

            .single();

        if (fetchError || !servicioExistente) {
            return res.status(403).send("No puedes eliminar este servicio");
        }

        // Eliminar imagen de Cloudinary si existe
        if (servicioExistente.imagen_referencia) {
            const publicId = servicioExistente.imagen_referencia.split("/").pop().split(".")[0];
            await cloudinary.uploader.destroy(`servicios/${publicId}`);
        }

        // Eliminar el servicio
        const { data, error } = await supabase
            .from("servicios")
            .delete()
            .eq("id_servicio", id)
            .select();

        if (error) throw error;

        res.json({
            mensaje: "Servicio eliminado con éxito",
            servicio: data[0]
        });
    } catch (error) {
        console.error("Error al eliminar servicio:", error.message);
        res.status(500).send("Error al eliminar servicio");
    }
});

export default router;
