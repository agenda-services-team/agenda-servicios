import express from "express";
import { supabase } from "../config/supabaseClient.js";
import { autenticar } from "../middleware/auth.js";
import multer from "multer";
import { cloudinary } from "../config/cloudinary.js"; // ⚠️ CAMBIAR ESTA LÍNEA

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Obtener todos los servicios (PÚBLICO)
router.get("/public/todos", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from("servicios")
            .select(`
                *,
                emprendimientos (
                    nombre_negocio,
                    logo,
                    usuarios (
                        nombre
                    )
                )
            `);

        if (error) throw error;

        const servicios = data.map(s => ({
            id_servicio: s.id_servicio,
            nombre: s.nombre_servicio,
            descripcion: s.descripcion,
            precio: s.precio,
            duracion: s.duracion,
            imagen_referencia: s.imagen_referencia,
            nombre_emprendimiento: s.emprendimientos?.nombre_negocio,
            logo_emprendimiento: s.emprendimientos?.logo,
            nombre_proveedor: s.emprendimientos?.usuarios?.nombre
        }));

        res.json(servicios);
    } catch (err) {
        console.error("Error al obtener servicios:", err);
        res.status(500).json({ mensaje: "Error al obtener servicios" });
    }
});

// Crear servicio
router.post("/", autenticar, upload.single("imagen"), async (req, res) => {
    try {
        console.log('📥 Creando servicio:', req.body);
        
        const { id_emprendimiento, nombre_servicio, descripcion, precio, duracion } = req.body;

        if (!id_emprendimiento || !nombre_servicio || !precio) {
            return res.status(400).json({ 
                mensaje: "Faltan campos requeridos",
                requeridos: ["id_emprendimiento", "nombre_servicio", "precio"]
            });
        }

        let imagenUrl = null;

        // Subir imagen a Cloudinary si existe
        if (req.file) {
            try {
                const uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { 
                            folder: "servicios",
                            resource_type: "image"
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(req.file.buffer);
                });
                imagenUrl = uploadResult.secure_url;
                console.log('✅ Imagen subida:', imagenUrl);
            } catch (error) {
                console.error('❌ Error al subir imagen:', error);
            }
        }

        const { data, error } = await supabase
            .from("servicios")
            .insert([{
                id_emprendimiento: parseInt(id_emprendimiento, 10),
                nombre_servicio,
                descripcion: descripcion || null,
                precio: parseFloat(precio),
                duracion: duracion ? parseInt(duracion, 10) : null,
                imagen_referencia: imagenUrl,
                fecha_creacion: new Date()
            }])
            .select()
            .single();

        if (error) {
            console.error('❌ Error de Supabase:', error);
            throw error;
        }

        console.log('✅ Servicio creado:', data);

        res.status(201).json({
            mensaje: "Servicio creado con éxito",
            servicio: data
        });
    } catch (err) {
        console.error("❌ Error al crear servicio:", err);
        res.status(500).json({ 
            mensaje: "Error al crear servicio",
            error: err.message
        });
    }
});

// Obtener servicio por ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from("servicios")
            .select(`
                *,
                emprendimientos (
                    id_emprendimiento,
                    nombre_negocio,
                    descripcion,
                    domicilio,
                    logo,
                    id_proveedor,
                    usuarios (
                        id_usuario,
                        nombre,
                        correo,
                        telefono
                    )
                )
            `)
            .eq("id_servicio", id)
            .single();

        if (error) throw error;

        const servicio = {
            ...data,
            nombre_emprendimiento: data.emprendimientos?.nombre_negocio,
            descripcion_emprendimiento: data.emprendimientos?.descripcion,
            domicilio_emprendimiento: data.emprendimientos?.domicilio,
            logo_emprendimiento: data.emprendimientos?.logo,
            id_proveedor: data.emprendimientos?.id_proveedor,
            nombre_proveedor: data.emprendimientos?.usuarios?.nombre,
            correo_proveedor: data.emprendimientos?.usuarios?.correo,
            telefono_proveedor: data.emprendimientos?.usuarios?.telefono
        };

        res.json(servicio);
    } catch (err) {
        console.error("Error al obtener servicio:", err);
        res.status(500).json({ mensaje: "Error al obtener servicio" });
    }
});

// Obtener servicios por emprendimiento
router.get("/emprendimiento/:empId", autenticar, async (req, res) => {
    try {
        const { empId } = req.params;

        const { data, error } = await supabase
            .from("servicios")
            .select("*")
            .eq("id_emprendimiento", empId);

        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error("Error al obtener servicios:", err);
        res.status(500).json({ mensaje: "Error al obtener servicios" });
    }
});

// Actualizar servicio
router.put("/:id", autenticar, upload.single("imagen"), async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_servicio, descripcion, precio, duracion } = req.body;

        let updateData = {
            nombre_servicio,
            descripcion,
            precio: parseFloat(precio),
            duracion: duracion ? parseInt(duracion, 10) : null
        };

        // Subir nueva imagen si existe
        if (req.file) {
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "servicios" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(req.file.buffer);
            });
            updateData.imagen_referencia = uploadResult.secure_url;
        }

        const { data, error } = await supabase
            .from("servicios")
            .update(updateData)
            .eq("id_servicio", id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            mensaje: "Servicio actualizado",
            servicio: data
        });
    } catch (err) {
        console.error("Error al actualizar servicio:", err);
        res.status(500).json({ mensaje: "Error al actualizar servicio" });
    }
});

// Eliminar servicio
router.delete("/:id", autenticar, async (req, res) => {
    try {
        const { id } = req.params;

        const { error } = await supabase
            .from("servicios")
            .delete()
            .eq("id_servicio", id);

        if (error) throw error;

        res.json({ mensaje: "Servicio eliminado con éxito" });
    } catch (err) {
        console.error("Error al eliminar servicio:", err);
        res.status(500).json({ mensaje: "Error al eliminar servicio" });
    }
});

export default router;