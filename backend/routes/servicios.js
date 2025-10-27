import express from "express";
import { supabase } from "../config/supabaseClient.js";
import { autenticar } from "../middleware/auth.js";
import cloudinary from "../config/cloudinary.js";
import multer from "multer";

const storage = multer.memoryStorage();
const upload = multer({
    storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const extname = filetypes.test(file.originalname.toLowerCase().split('.').pop());
        const mimetype = filetypes.test(file.mimetype);

        if (extname && mimetype) {
            return cb(null, true);
        } else {
            cb(new Error("Solo se permiten imágenes JPEG, PNG o WebP"));
        }
    },
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB límite
    }
});

const router = express.Router();

// 🆕 DEBUG: Ver todas las rutas que se acceden
router.use((req, res, next) => {
    console.log('📍 RUTA ACCEDIDA:', req.method, req.url);
    next();
});

// 🆕 MIDDLEWARE PARA SOLO PROVEEDORES
const soloProveedores = (req, res, next) => {
    if (req.usuario.tipo_usuario !== 'proveedor') {
        return res.status(403).json({ 
            error: "Acceso denegado. Se requieren permisos de proveedor." 
        });
    }
    next();
};

// ========== ENDPOINTS PÚBLICOS ==========

// 🆕 ENDPOINT DE DETALLE - DEBE IR PRIMERO
router.get("/detalle/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🎯🎯🎯 EJECUTANDO /detalle/:id para ID: ${id} 🎯🎯🎯`);
        
        // CONSULTA DIRECTA Y SIMPLE
        const { data: servicioData, error: servicioError } = await supabase
            .from("servicios")
            .select("*")
            .eq("id_servicio", id)
            .single();

        console.log('📊 Resultado consulta detalle:', {
            tieneData: !!servicioData,
            error: servicioError
        });

        if (servicioError) {
            console.error('❌ Error específico:', servicioError);
            if (servicioError.code === 'PGRST116') {
                return res.status(404).json({ 
                    error: `Servicio con ID ${id} no encontrado en la base de datos` 
                });
            }
            return res.status(500).json({ 
                error: "Error de base de datos" 
            });
        }

        if (!servicioData) {
            return res.status(404).json({ 
                error: `Servicio con ID ${id} no existe` 
            });
        }

        console.log('✅✅✅ SERVICIO ENCONTRADO EN DETALLE:', servicioData.nombre_servicio);

        // Respuesta simplificada - SOLO datos del servicio
        const servicio = {
            id_servicio: servicioData.id_servicio,
            nombre: servicioData.nombre_servicio,
            descripcion: servicioData.descripcion,
            precio: servicioData.precio,
            duracion: servicioData.duracion,
            imagen_referencia: servicioData.imagen_referencia,
            id_emprendimiento: servicioData.id_emprendimiento,
            mensaje: "Detalle cargado exitosamente"
        };

        res.json(servicio);

    } catch (error) {
        console.error("💥 Error crítico en /detalle/:id:", error.message);
        res.status(500).json({ 
            error: "Error interno del servidor" 
        });
    }
});

// Obtener TODOS los servicios para clientes
router.get("/public/todos", async (req, res) => {
    try {
        console.log('🔍 Ejecutando /public/todos');

        const { data, error } = await supabase
            .from("servicios")
            .select("*")
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
            imagen_referencia: s.imagen_referencia
        }));

        res.json(servicios);
    } catch (error) {
        console.error("💥 Error al obtener servicios públicos:", error.message);
        res.status(500).json({ 
            error: "Error al obtener servicios" 
        });
    }
});

// Obtener servicios públicos (versión simple)
router.get("/public/cliente", async (req, res) => {
    try {
        console.log('🔍 Ejecutando /public/cliente');

        const { data, error } = await supabase
            .from("servicios")
            .select("*")
            .order("id_servicio", { ascending: true });

        if (error) throw error;

        const servicios = data.map((s) => ({
            id_servicio: s.id_servicio,
            nombre: s.nombre_servicio,
            descripcion: s.descripcion,
            precio: s.precio,
            duracion: s.duracion,
            imagen_referencia: s.imagen_referencia
        }));

        res.json(servicios);
    } catch (error) {
        console.error("💥 Error en /public/cliente:", error.message);
        res.status(500).json({ 
            error: "Error al obtener servicios" 
        });
    }
});

// ========== ENDPOINTS DE PROVEEDOR ==========

// Crear servicio
router.post("/", autenticar, soloProveedores, upload.single("imagen"), async (req, res) => {
    try {
        const { nombre_servicio, descripcion, precio, duracion } = req.body;
        const id_emprendimiento = req.usuario.id_emprendimiento;

        // Validaciones
        if (!nombre_servicio || !descripcion || precio == null || !duracion) {
            return res.status(400).json({ 
                error: "Todos los campos son obligatorios" 
            });
        }

        if (precio < 0) {
            return res.status(400).json({ 
                error: "El precio debe ser un valor positivo" 
            });
        }

        let imagen_referencia = null;

        // Subir imagen a Cloudinary si se proporcionó
        if (req.file) {
            try {
                const result = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { 
                            folder: "servicios",
                            transformation: [
                                { width: 800, height: 600, crop: "limit" },
                                { quality: "auto" },
                                { format: "webp" }
                            ]
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    stream.end(req.file.buffer);
                });

                imagen_referencia = result.secure_url;
                console.log("✅ Imagen subida a Cloudinary:", imagen_referencia);
            } catch (uploadError) {
                console.error("❌ Error subiendo imagen:", uploadError);
                return res.status(500).json({ 
                    error: "Error al subir la imagen" 
                });
            }
        }

        // Insertar servicio en Supabase
        const { data, error } = await supabase
            .from("servicios")
            .insert({
                nombre_servicio: nombre_servicio.trim(),
                descripcion: descripcion.trim(),
                precio: parseFloat(precio),
                duracion: parseInt(duracion),
                id_emprendimiento: id_emprendimiento,
                imagen_referencia: imagen_referencia,
                fecha_creacion: new Date().toISOString()
            })
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
            .single();

        if (error) {
            console.error("❌ Error insertando servicio:", error);
            throw error;
        }

        const servicioCreado = {
            id_servicio: data.id_servicio,
            nombre: data.nombre_servicio,
            descripcion: data.descripcion,
            precio: data.precio,
            duracion: data.duracion,
            imagen_referencia: data.imagen_referencia,
            nombre_emprendimiento: data.emprendimientos?.nombre_negocio || "Sin nombre",
            nombre_proveedor: data.emprendimientos?.usuarios?.nombre || "Desconocido"
        };

        console.log("✅ Servicio creado exitosamente:", servicioCreado.nombre);

        res.status(201).json({
            mensaje: "Servicio creado con éxito",
            servicio: servicioCreado
        });

    } catch (error) {
        console.error("💥 Error al crear servicio:", error.message);
        res.status(500).json({ 
            error: "Error al crear servicio: " + error.message 
        });
    }
});

// Obtener servicios del proveedor logeado
router.get("/proveedor/mis-servicios", autenticar, soloProveedores, async (req, res) => {
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
        res.status(500).json({ 
            error: "Error al obtener servicios: " + error.message 
        });
    }
});

// Actualizar servicio
router.put("/:id", autenticar, soloProveedores, upload.single("imagen"), async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_servicio, descripcion, precio, duracion } = req.body;
        const id_emprendimiento = req.usuario.id_emprendimiento;
        let imagen_referencia = null;

        if (!nombre_servicio || !descripcion || precio == null || !duracion) {
            return res.status(400).json({ 
                error: "Todos los campos son obligatorios" 
            });
        }

        if (precio < 0) {
            return res.status(400).json({ 
                error: "El precio debe ser un valor positivo" 
            });
        }

        // Verificar si el servicio pertenece al emprendimiento del usuario
        const { data: servicioExistente, error: fetchError } = await supabase
            .from("servicios")
            .select("*")
            .eq("id_servicio", id)
            .eq("id_emprendimiento", id_emprendimiento)
            .single();

        if (fetchError || !servicioExistente) {
            return res.status(403).json({ 
                error: "No puedes actualizar este servicio" 
            });
        }

        // Subir nueva imagen a Cloudinary si se proporcionó
        if (req.file) {
            try {
                const result = await new Promise((resolve, reject) => {
                    const stream = cloudinary.uploader.upload_stream(
                        { 
                            folder: "servicios",
                            transformation: [
                                { width: 800, height: 600, crop: "limit" },
                                { quality: "auto" },
                                { format: "webp" }
                            ]
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    stream.end(req.file.buffer);
                });

                imagen_referencia = result.secure_url;
                
                // Eliminar imagen anterior de Cloudinary si existe
                if (servicioExistente.imagen_referencia) {
                    try {
                        const publicId = servicioExistente.imagen_referencia.split('/').pop().split('.')[0];
                        await cloudinary.uploader.destroy(`servicios/${publicId}`);
                        console.log("✅ Imagen anterior eliminada de Cloudinary");
                    } catch (deleteError) {
                        console.warn("⚠️ No se pudo eliminar la imagen anterior:", deleteError);
                    }
                }
            } catch (uploadError) {
                console.error("❌ Error subiendo imagen:", uploadError);
                return res.status(500).json({ 
                    error: "Error al subir la imagen" 
                });
            }
        }

        // Actualizar servicio
        const updateData = {
            nombre_servicio: nombre_servicio.trim(),
            descripcion: descripcion.trim(),
            precio: parseFloat(precio),
            duracion: parseInt(duracion)
        };

        if (imagen_referencia) {
            updateData.imagen_referencia = imagen_referencia;
        }

        const { data, error } = await supabase
            .from("servicios")
            .update(updateData)
            .eq("id_servicio", id)
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
            `);

        if (error) throw error;

        const servicioActualizado = {
            id_servicio: data[0].id_servicio,
            nombre: data[0].nombre_servicio,
            descripcion: data[0].descripcion,
            precio: data[0].precio,
            duracion: data[0].duracion,
            imagen_referencia: data[0].imagen_referencia,
            nombre_emprendimiento: data[0].emprendimientos?.nombre_negocio || "Sin nombre",
            nombre_proveedor: data[0].emprendimientos?.usuarios?.nombre || "Desconocido"
        };

        res.json({
            mensaje: "Servicio actualizado con éxito",
            servicio: servicioActualizado
        });
    } catch (error) {
        console.error("Error al actualizar servicio:", error.message);
        res.status(500).json({ 
            error: "Error al actualizar servicio: " + error.message 
        });
    }
});

// Eliminar servicio
router.delete("/:id", autenticar, soloProveedores, async (req, res) => {
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
            return res.status(403).json({ 
                error: "No puedes eliminar este servicio" 
            });
        }

        // Eliminar imagen de Cloudinary si existe
        if (servicioExistente.imagen_referencia) {
            try {
                const publicId = servicioExistente.imagen_referencia.split('/').pop().split('.')[0];
                await cloudinary.uploader.destroy(`servicios/${publicId}`);
                console.log("✅ Imagen eliminada de Cloudinary");
            } catch (deleteError) {
                console.warn("⚠️ No se pudo eliminar la imagen de Cloudinary:", deleteError);
            }
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
        res.status(500).json({ 
            error: "Error al eliminar servicio: " + error.message 
        });
    }
});

// Obtener servicio por ID (para proveedores) - DEBE IR AL FINAL
router.get("/:id", autenticar, soloProveedores, async (req, res) => {
    try {
        const { id } = req.params;

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
            .eq("id_servicio", id)
            .eq("id_emprendimiento", req.usuario.id_emprendimiento)
            .single();

        if (error || !data) {
            return res.status(404).json({ 
                error: "Servicio no encontrado" 
            });
        }

        const servicio = {
            id_servicio: data.id_servicio,
            nombre: data.nombre_servicio,
            descripcion: data.descripcion,
            precio: data.precio,
            duracion: data.duracion,
            id_emprendimiento: data.id_emprendimiento,
            nombre_emprendimiento: data.emprendimientos?.nombre_negocio || "Sin nombre",
            nombre_proveedor: data.emprendimientos?.usuarios?.nombre || "Desconocido",
            imagen_referencia: data.imagen_referencia
        };

        res.json(servicio);
    } catch (error) {
        console.error("Error al obtener servicio por ID:", error.message);
        res.status(500).json({ 
            error: "Error al obtener servicio por ID" 
        });
    }
});

export default router;