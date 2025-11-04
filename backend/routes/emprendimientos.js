import express from 'express';
import { supabase } from '../config/supabaseClient.js';
import { autenticar } from '../middleware/auth.js';
import multer from 'multer';
import { cloudinary } from '../config/cloudinary.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Crear emprendimiento
router.post('/', autenticar, upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'imagenes', maxCount: 10 }
]), async (req, res) => {
    try {
        console.log('📥 Request recibido:', {
            body: req.body,
            files: req.files,
            user: req.usuario
        });

        const { nombre_negocio, descripcion, domicilio, hora_apertura, hora_cierre } = req.body;
        let { id_proveedor } = req.body;

        // Usar el ID del usuario autenticado si no viene en el body
        if (!id_proveedor) {
            id_proveedor = req.usuario.id_usuario;
        }

        // Convertir a número entero
        id_proveedor = parseInt(id_proveedor, 10);

        console.log('🔍 ID Proveedor procesado:', id_proveedor, 'Tipo:', typeof id_proveedor);

        // Validación
        if (!id_proveedor || isNaN(id_proveedor)) {
            return res.status(400).json({ 
                mensaje: 'ID de proveedor inválido',
                recibido: req.body.id_proveedor,
                procesado: id_proveedor
            });
        }

        if (!nombre_negocio) {
            return res.status(400).json({ mensaje: 'El nombre del negocio es requerido' });
        }

        // Verificar si ya tiene emprendimiento
        const { data: existente, error: errorExiste } = await supabase
            .from('emprendimientos')
            .select('*')
            .eq('id_proveedor', id_proveedor)
            .maybeSingle();

        if (errorExiste) {
            console.error('❌ Error al verificar emprendimiento:', errorExiste);
        }

        if (existente) {
            return res.status(400).json({ 
                mensaje: 'Ya tienes un emprendimiento registrado',
                emprendimiento: existente
            });
        }

        let logoUrl = null;
        let imagenesUrls = [];

        // Subir logo a Cloudinary
        if (req.files?.logo && req.files.logo[0]) {
            try {
                const logoBuffer = req.files.logo[0].buffer;
                const uploadResult = await new Promise((resolve, reject) => {
                    const uploadStream = cloudinary.uploader.upload_stream(
                        { 
                            folder: 'emprendimientos/logos',
                            resource_type: 'image'
                        },
                        (error, result) => {
                            if (error) reject(error);
                            else resolve(result);
                        }
                    );
                    uploadStream.end(logoBuffer);
                });
                logoUrl = uploadResult.secure_url;
                console.log('✅ Logo subido a Cloudinary:', logoUrl);
            } catch (error) {
                console.error('❌ Error al subir logo:', error);
                // Continuar sin logo
            }
        }

        // Subir imágenes a Cloudinary
        if (req.files?.imagenes && req.files.imagenes.length > 0) {
            for (const img of req.files.imagenes) {
                try {
                    const uploadResult = await new Promise((resolve, reject) => {
                        const uploadStream = cloudinary.uploader.upload_stream(
                            { 
                                folder: 'emprendimientos/galeria',
                                resource_type: 'image'
                            },
                            (error, result) => {
                                if (error) reject(error);
                                else resolve(result);
                            }
                        );
                        uploadStream.end(img.buffer);
                    });
                    imagenesUrls.push(uploadResult.secure_url);
                    console.log('✅ Imagen subida a Cloudinary:', uploadResult.secure_url);
                } catch (error) {
                    console.error('❌ Error al subir imagen:', error);
                    // Continuar con las demás imágenes
                }
            }
        }

        // Insertar en Supabase
        const { data, error } = await supabase
            .from('emprendimientos')
            .insert([{
                id_proveedor,
                nombre_negocio,
                descripcion: descripcion || null,
                domicilio: domicilio || null,
                hora_apertura: hora_apertura || null,
                hora_cierre: hora_cierre || null,
                logo: logoUrl,
                imagenes_trabajos: imagenesUrls.length > 0 ? JSON.stringify(imagenesUrls) : null,
                fecha_creacion: new Date()
            }])
            .select()
            .single();

        if (error) {
            console.error('❌ Error de Supabase:', error);
            throw error;
        }

        console.log('✅ Emprendimiento creado exitosamente:', data);

        res.status(201).json({
            mensaje: 'Emprendimiento creado con éxito',
            emprendimiento: data
        });

    } catch (err) {
        console.error('❌ Error al crear emprendimiento:', err);
        res.status(500).json({ 
            mensaje: 'Error al crear emprendimiento',
            error: err.message
        });
    }
});

// Obtener emprendimiento por usuario
router.get('/usuario/:userId', autenticar, async (req, res) => {
    try {
        const userId = parseInt(req.params.userId, 10);

        console.log('🔍 Buscando emprendimiento para usuario:', userId);

        const { data, error } = await supabase
            .from('emprendimientos')
            .select('*')
            .eq('id_proveedor', userId)
            .maybeSingle();

        if (error) {
            console.error('❌ Error al buscar emprendimiento:', error);
            throw error;
        }

        if (!data) {
            return res.status(404).json({ 
                tieneEmprendimiento: false,
                mensaje: 'No tienes un emprendimiento registrado'
            });
        }

        res.json({
            tieneEmprendimiento: true,
            emprendimiento: data
        });

    } catch (err) {
        console.error('❌ Error al obtener emprendimiento:', err);
        res.status(500).json({ 
            mensaje: 'Error al obtener emprendimiento',
            error: err.message
        });
    }
});

// Obtener emprendimiento por ID
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('emprendimientos')
            .select('*')
            .eq('id_emprendimiento', id)
            .single();

        if (error) throw error;

        res.json(data);
    } catch (err) {
        console.error('Error al obtener emprendimiento:', err);
        res.status(500).json({ mensaje: 'Error al obtener emprendimiento' });
    }
});

// Actualizar emprendimiento
router.put('/:id', autenticar, upload.fields([
    { name: 'logo', maxCount: 1 },
    { name: 'imagenes', maxCount: 10 }
]), async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre_negocio, descripcion, domicilio, hora_apertura, hora_cierre } = req.body;

        let updateData = {
            nombre_negocio,
            descripcion,
            domicilio,
            hora_apertura,
            hora_cierre
        };

        // Subir nuevo logo si existe
        if (req.files?.logo) {
            const logoBuffer = req.files.logo[0].buffer;
            const uploadResult = await new Promise((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: 'emprendimientos/logos' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                uploadStream.end(logoBuffer);
            });
            updateData.logo = uploadResult.secure_url;
        }

        const { data, error } = await supabase
            .from('emprendimientos')
            .update(updateData)
            .eq('id_emprendimiento', id)
            .select()
            .single();

        if (error) throw error;

        res.json({
            mensaje: 'Emprendimiento actualizado',
            emprendimiento: data
        });

    } catch (err) {
        console.error('Error al actualizar emprendimiento:', err);
        res.status(500).json({ mensaje: 'Error al actualizar emprendimiento' });
    }
});

export default router;
