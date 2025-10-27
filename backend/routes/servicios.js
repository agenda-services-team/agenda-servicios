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

// Obtener TODOS los servicios para clientes
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
        }));

        res.json(servicios);
    } catch (error) {
        console.error("💥 Error al obtener servicios públicos:", error.message);
        res.status(500).json({ 
            error: "Error al obtener servicios: " + error.message 
        });
    }
});

// Obtener servicios públicos (alias de /public/todos)
router.get("/public/cliente", async (req, res) => {
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
                    telefono,
                    direccion,
                    usuarios (
                        id_usuario,
                        nombre,
                        telefono
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
            telefono_emprendimiento: s.emprendimientos?.telefono,
            direccion_emprendimiento: s.emprendimientos?.direccion,
            id_proveedor: s.emprendimientos?.usuarios?.id_usuario,
            nombre_proveedor: s.emprendimientos?.usuarios?.nombre || "Desconocido",
            telefono_proveedor: s.emprendimientos?.usuarios?.telefono
        }));

        res.json(servicios);
    } catch (error) {
        console.error("💥 Error al obtener servicios para cliente:", error.message);
        res.status(500).json({ 
            error: "Error al obtener servicios: " + error.message 
        });
    }
});

// 🆕 ENDPOINT DE DETALLE MEJORADO
// 🆕 ENDPOINT PARA DETALLE DE SERVICIO - AGREGAR ESTO
router.get("/detalle/:id", async (req, res) => {
    try {
        const { id } = req.params;
        console.log(`🔍 Buscando detalle del servicio ID: ${id}`);
        
        const { data, error } = await supabase
            .from("servicios")
            .select(`
                *,
                emprendimientos (
                    nombre_negocio,
                    descripcion,
                    telefono,
                    direccion,
                    horario_atencion,
                    usuarios (
                        nombre,
                        telefono,
                        correo
                    )
                )
            `)
            .eq("id_servicio", id)
            .single();

        if (error || !data) {
            console.error("❌ Servicio no encontrado:", error);
            return res.status(404).json({ 
                error: "Servicio no encontrado" 
            });
        }

        // Formatear respuesta para el frontend
        const servicio = {
            id_servicio: data.id_servicio,
            nombre: data.nombre_servicio,
            descripcion: data.descripcion,
            precio: data.precio,
            duracion: data.duracion,
            imagen_referencia: data.imagen_referencia,
            // Información del emprendimiento
            emprendimiento: {
                nombre: data.emprendimientos?.nombre_negocio || "Sin nombre",
                descripcion: data.emprendimientos?.descripcion,
                telefono: data.emprendimientos?.telefono,
                direccion: data.emprendimientos?.direccion,
                horario: data.emprendimientos?.horario_atencion
            },
            // Información del proveedor
            proveedor: {
                nombre: data.emprendimientos?.usuarios?.nombre || "Desconocido",
                telefono: data.emprendimientos?.usuarios?.telefono,
                email: data.emprendimientos?.usuarios?.correo
            }
        };

        console.log(`✅ Detalles del servicio ${id} cargados`);
        res.json(servicio);

    } catch (error) {
        console.error("💥 Error al obtener detalle del servicio:", error.message);
        res.status(500).json({ 
            error: "Error al obtener detalle del servicio: " + error.message 
        });
    }
});
// ========== ENDPOINTS DE PROVEEDOR ==========

// 🆕 CREAR SERVICIO (FALTABA ESTE ENDPOINT)
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

// Obtener todos los servicios del proveedor (alias de /proveedor/mis-servicios)
router.get("/", autenticar, soloProveedores, async (req, res) => {
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
        res.status(500).json({ 
            error: "Error al obtener servicios" 
        });
    }
});

// Obtener servicio por ID (para proveedores)
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

// 🆕 ACTUALIZAR SERVICIO CORREGIDO
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
                
                // 🆕 Eliminar imagen anterior de Cloudinary si existe
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

export default router;