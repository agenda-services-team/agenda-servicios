const express = require("express");
const pool = require("../db/db");
const autenticar = require("../middleware/auth");
const router = express.Router();

// Crear servicio (solo usuarios autenticados)
router.post("/", autenticar, async (req, res) => {
    try {
        const { nombre, descripcion, precio } = req.body;
        const id_prestador = req.usuario.id_usuario;

        // Validar que los campos no esten vacios
        if (!nombre || !descripcion || precio == null) {
            return res.status(400).send("Todos los campos son obligatorios");
        }
        if (precio < 0) {
            return res.status(400).send("El precio debe ser un valor positivo");
        }

        const result = await pool.query(
            "INSERT INTO servicios (id_prestador, nombre, descripcion, precio) VALUES ($1, $2, $3, $4) RETURNING *",
            [id_prestador, nombre, descripcion, precio]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al crear servicio");
    }
});

// Listar todos los servicios
router.get("/", autenticar, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT s.*, u.nombre AS prestador_nombre FROM servicios s JOIN usuarios u ON s.id_prestador = u.id_usuario"
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al obtener servicios");
    }
});

// Obtener un servicio por ID
router.get("/:id", autenticar, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "SELECT s.*, u.nombre AS prestador_nombre FROM servicios s JOIN usuarios u ON s.id_prestador = u.id_usuario WHERE s.id_servicio = $1",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send("Servicio no encontrado");
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al obtener servicio");
    }
});

// Actualizar servicio (solo el prestador puede actualizar)
router.put("/:id", autenticar, async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, descripcion, precio } = req.body;
        const id_prestador = req.usuario.id_usuario;

        // Validar que no esten vacios
        if (!nombre || !descripcion || precio == null) {
            return res.status(400).send("Todos los campos son obligatorios");
        }
        if (precio < 0) {
            return res.status(400).send("El precio debe ser un valor positivo");
        }

        // Verificar propietario
        const servicioExistente = await pool.query(
            "SELECT * FROM servicios WHERE id_servicio = $1 AND id_prestador = $2",
            [id, id_prestador]
        );

        if (servicioExistente.rows.length === 0) {
            return res.status(403).send("No puedes actualizar este servicio");
        }

        const result = await pool.query(
            "UPDATE servicios SET nombre = $1, descripcion = $2, precio = $3 WHERE id_servicio = $4 RETURNING *",
            [nombre, descripcion, precio, id]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al actualizar servicio");
    }
});

// Eliminar servicio (solo el prestador puede eliminar)
router.delete("/:id", autenticar, async (req, res) => {
    try {
        const { id } = req.params;
        const id_prestador = req.usuario.id_usuario;

        // Verificar propietario
        const servicioExistente = await pool.query(
            "SELECT * FROM servicios WHERE id_servicio = $1 AND id_prestador = $2",
            [id, id_prestador]
        );

        if (servicioExistente.rows.length === 0) {
            return res.status(403).send("No puedes eliminar este servicio");
        }

        const result = await pool.query(
            "DELETE FROM servicios WHERE id_servicio = $1 RETURNING *",
            [id]
        );

        res.json({ mensaje: "Servicio eliminado", servicio: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al eliminar servicio");
    }
});

module.exports = router;
