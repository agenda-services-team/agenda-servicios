const express = require("express");
const pool = require("../db/db");
const autenticar = require("../middleware/auth");
const router = express.Router();

// Crear una cita
router.post("/", autenticar, async (req, res) => {
    try {
        const { id_servicio, fecha, hora } = req.body;
        const id_cliente = req.usuario.id_usuario;

        // Validar que no hay vacios
        if (!id_servicio || !fecha || !hora) {
            return res.status(400).send("Todos los campos son obligatorios");
        }

        const fechaHoy = new Date();
        const fechaCita = new Date(fecha + " " + hora);
        if (fechaCita < fechaHoy) {
            return res.status(400).send("No puedes reservar en una fecha pasada");
        }

        const horaNum = parseInt(hora.split(":")[0]);
        if (horaNum < 8 || horaNum > 20) {
            return res.status(400).send("Horario fuera del rango permitido (08:00-20:00)");
        }

        // Validar que no exista otra cita en el mismo servicio, fecha y hora
        const existe = await pool.query(
            "SELECT * FROM citas WHERE id_servicio = $1 AND fecha = $2 AND hora = $3",
            [id_servicio, fecha, hora]
        );

        if (existe.rows.length > 0) {
            return res.status(400).send("Ese horario ya está reservado");
        }

        const result = await pool.query(
            "INSERT INTO citas (id_cliente, id_servicio, fecha, hora, estado, creado_en) VALUES ($1, $2, $3, $4, 'activa', NOW()) RETURNING *",
            [id_cliente, id_servicio, fecha, hora]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al crear cita");
    }
});

// Listar todas las citas
router.get("/", autenticar, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT c.id_cita, c.fecha, c.hora, c.estado, c.creado_en,
                    u.nombre AS cliente, u.correo,
                    s.nombre AS servicio, s.precio, s.descripcion
             FROM citas c
             JOIN usuarios u ON c.id_cliente = u.id_usuario
             JOIN servicios s ON c.id_servicio = s.id_servicio
             ORDER BY c.fecha, c.hora`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al obtener citas");
    }
});

// Obtener cita por ID
router.get("/:id", autenticar, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            `SELECT c.id_cita, c.fecha, c.hora, c.estado, c.creado_en,
                    u.nombre AS cliente, u.correo,
                    s.nombre AS servicio, s.precio, s.descripcion
             FROM citas c
             JOIN usuarios u ON c.id_cliente = u.id_usuario
             JOIN servicios s ON c.id_servicio = s.id_servicio
             WHERE c.id_cita = $1`, [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send("Cita no encontrada");
        }

        res.json(result.rows[0]);
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

        // Validar que los campos no esten vacios
        if (!fecha || !hora) {
            return res.status(400).send("Todos los campos son obligatorios");
        }
        const fechaHoy = new Date();
        const fechaCita = new Date(fecha + " " + hora);
        if (fechaCita < fechaHoy) {
            return res.status(400).send("No puedes reservar en una fecha pasada");
        }
        const horaNum = parseInt(hora.split(":")[0]);
        if (horaNum < 8 || horaNum > 20) {
            return res.status(400).send("Horario fuera del rango permitido (08:00-20:00)");
        }

        // Verificar que no haya otra cita en ese horario
        const existe = await pool.query(
            "SELECT * FROM citas WHERE id_cita != $1 AND fecha = $2 AND hora = $3",
            [id, fecha, hora]
        );

        if (existe.rows.length > 0) {
            return res.status(400).send("Ese horario ya está ocupado");
        }

        const result = await pool.query(
            "UPDATE citas SET fecha = $1, hora = $2 WHERE id_cita = $3 RETURNING *",
            [fecha, hora, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send("Cita no encontrada");
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al actualizar cita");
    }
});

// Eliminar cita
router.delete("/:id", autenticar, async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query(
            "DELETE FROM citas WHERE id_cita = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).send("Cita no encontrada");
        }

        res.json({ mensaje: "Cita eliminada", cita: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al eliminar cita");
    }
});

module.exports = router;
