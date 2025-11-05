import express from 'express';
import multer from 'multer';
import { supabase } from '../config/supabaseClient.js';
import cloudinary from '../config/cloudinary.js';

const router = express.Router();

// Asi se configura el multer para manejar archivos en memoria
const storage = multer.memoryStorage();
const upload = multer({ storage });

//Se verifica si el usuario ya tiene un emprendimiento
router.get('/usuario/:id_usuario', async (req, res) => {
    try {
        const { id_usuario } = req.params;

        const { data, error } = await supabase
            .from('emprendimientos')
            .select('id_emprendimiento, nombre_negocio, descripcion, logo')
            .eq('id_proveedor', id_usuario);

        if (error) throw error;

        if (data.length > 0) {
            //Devuelve información del emprendimiento si existe
            res.json({
                tieneEmprendimiento: true,
                nombre_negocio: data[0].nombre_negocio,
                logo: data[0].logo,
                descripcion: data[0].descripcion,
            });
        } else {
            //Si no tiene emprendimiento registrado
            res.json({ tieneEmprendimiento: false });
        }
    } catch (error) {
        console.error('Error al verificar emprendimiento:', error.message);
        res.status(500).send('Error al verificar emprendimiento');
    }
});

// Para crear un emprendimiento con el logo
router.post('/', upload.single('logo'), async (req, res) => {
    try {
        const { id_proveedor, nombre_negocio, descripcion, domicilio, hora_apertura, hora_cierre } = req.body;

        let logoUrl = null;

        // Si se envía un logo, se sube a Cloudinary
        if (req.file) {
            const result = await new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: 'emprendimientos/logos' },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result);
                    }
                );
                stream.end(req.file.buffer);
            });

            logoUrl = result.secure_url; //Se guarda la URL del logo
        }

        // Insertar emprendimiento en Supabase
        const { data, error } = await supabase
            .from('emprendimientos')
            .insert([
                {
                    id_proveedor,
                    nombre_negocio,
                    descripcion,
                    domicilio,
                    hora_apertura,
                    hora_cierre,
                    logo: logoUrl
                }
            ])
            .select();

        if (error) throw error;

        res.json({
            mensaje: 'Emprendimiento creado con éxito',
            emprendimiento: data[0]
        });
    } catch (error) {
        console.error('Error al crear emprendimiento:', error.message);
        res.status(500).send('Error al crear emprendimiento');
    }
});

export default router;
