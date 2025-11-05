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

// Subir imagen a Cloudinary y guardar la url en Supabase
router.post("/upload", autenticar, upload.single("imagen"), async (req, res) => {
	const start = Date.now();
	try {
		const id_emprendimiento = req.usuario?.id_emprendimiento;
		const { titulo } = req.body;

		if (!req.file) return res.status(400).send("No se proporcionó ninguna imagen");

		const result = await new Promise((resolve, reject) => {
			const stream = cloudinary.uploader.upload_stream(
				{ folder: "galeria" },
				(error, result) => {
					if (error) reject(error);
					else resolve(result);
				}
			);
			stream.end(req.file.buffer);
		});

		const imagen_referencia = result.secure_url;

		// Comprobación rápida: si ya existe una fila con la misma url_imagen devolvemos esa fila
		try {
			const { data: existing, error: fetchErr } = await supabase
				.from('imagenes_emprendimiento')
				.select('*')
				.eq('url_imagen', imagen_referencia)
				.single();

			if (!fetchErr && existing) {
				console.log(`Galeria: imagen ya existente en BD (url) - tiempo: ${Date.now() - start}ms`);
				return res.json({ mensaje: 'Imagen ya existe', imagen: existing });
			}
		} catch (e) {
			// ignore: si no existe la tabla o error, seguimos al insert
		}

		// Intentar insertar en la tabla existente 'imagenes_emprendimiento'
		try {
			const { data, error } = await supabase
				.from("imagenes_emprendimiento")
				.insert([
					{
						id_emprendimiento: id_emprendimiento || null,
						url_imagen: imagen_referencia
					}
				])
				.select();

			if (error) throw error;

			console.log(`Galeria: subida completada - tiempo: ${Date.now() - start}ms`);
			return res.json({ mensaje: "Imagen subida", imagen: data[0] });
		} catch (dbError) {
			// Si por alguna razón no existe la tabla, devolvemos la info de Cloudinary
			console.warn("No se pudo guardar metadata en Supabase (verifique tabla 'imagenes_emprendimiento'):", dbError.message);
			console.log(`Galeria: subida (sin guardar metadata) - tiempo: ${Date.now() - start}ms`);
			return res.json({ mensaje: "Imagen subida (metadata no guardada)", imagen: { url_imagen: imagen_referencia } });
		}
	} catch (error) {
		console.error("Error al subir imagen:", error.message);
		res.status(500).send("Error al subir imagen");
	}
});

// Obtener imágenes 
router.get("/", async (req, res) => {
	try {
		const id_emprendimiento = req.query.id_emprendimiento;

		// Intentar leer desde Supabase si existe la tabla
		try {
			let query = supabase.from("imagenes_emprendimiento").select("*").order("id_imagen", { ascending: true });
			if (id_emprendimiento) query = query.eq("id_emprendimiento", id_emprendimiento);
			const { data, error } = await query;
			if (error) throw error;
			return res.json(data);
		} catch (dbErr) {
			console.warn("No se pudo leer tabla 'imagenes_emprendimiento' en Supabase:", dbErr.message);
			// Se devuelve un array vacio si no existe la tabla
			return res.json([]);
		}
	} catch (error) {
		console.error("Error al obtener galería:", error.message);
		res.status(500).send("Error al obtener galería");
	}
});

// Eliminar imagen (requiere autenticación y que la imagen pertenezca al emprendimiento)
router.delete("/:id_imagen", autenticar, async (req, res) => {
	try {
		const { id_imagen } = req.params;
		const id_emprendimiento = req.usuario?.id_emprendimiento;

		// Intentar obtener la fila en la tabla 'imagenes_emprendimiento'
		try {
			const { data: existing, error: fetchError } = await supabase
				.from("imagenes_emprendimiento")
				.select("*")
				.eq("id_imagen", id_imagen)
				.single();

			if (fetchError || !existing) {
				return res.status(404).send("Imagen no encontrada en metadata");
			}

			if (existing.id_emprendimiento && id_emprendimiento && existing.id_emprendimiento !== id_emprendimiento) {
				return res.status(403).send("No tienes permiso para eliminar esta imagen");
			}

			// Intentar derivar public_id desde la URL para eliminar de Cloudinary
			const url = existing.url_imagen || existing.imagen_referencia || existing.url;
			const publicId = (url) ? extractPublicIdFromUrl(url) : null;

			if (publicId) {
				try {
					await cloudinary.uploader.destroy(publicId);
				} catch (cloudErr) {
					console.warn("No se pudo eliminar de Cloudinary (se continuará con la eliminación de metadata):", cloudErr.message);
				}
			}

			// Eliminar imagen
			const { data, error } = await supabase.from("imagenes_emprendimiento").delete().eq("id_imagen", id_imagen).select();
			if (error) throw error;

			res.json({ mensaje: "Imagen eliminada", imagen: data[0] });
		} catch (dbErr) {
			console.warn("Error al eliminar metadata en Supabase (o tabla no existe):", dbErr.message);
			return res.status(500).send("Error al eliminar imagen");
		}
	} catch (error) {
		console.error("Error al eliminar imagen:", error.message);
		res.status(500).send("Error al eliminar imagen");
	}
});

function extractPublicIdFromUrl(url) {
	try {
		// Cloudinary URLs 
		const parts = url.split('/upload/');
		if (parts.length < 2) return null;
		let after = parts[1];
		// eliminar el segmento de versión si existe (p.ej. v1623456789/)
		after = after.replace(/^v\d+\//, '');
		// quitar extensión
		after = after.replace(/\.[^/.]+$/, '');
		return after;
	} catch (e) {
		return null;
	}
}

export default router;

