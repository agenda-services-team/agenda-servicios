
const express = require("express");
const pool = require("../db/db");
const router = express.Router();

// Login de usuario
router.post("/login", async (req, res) => {
    try {
        const { correo, contrasena } = req.body;
        const result = await pool.query(
            "SELECT * FROM usuarios WHERE correo = $1 AND contrasena = $2",
            [correo, contrasena]
        );
        if (result.rows.length === 0) {
            return res.status(401).json({ mensaje: "Correo o contraseña incorrectos" });
        }
        // Aquí podrías generar un token si lo deseas
        res.json({ mensaje: "Login exitoso", usuario: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al iniciar sesión");
    }
});

// Registro de usuario
router.post("/registro", async (req, res) => {
    try {
        const { nombre, correo, contrasena, tipo_usuario } = req.body;
        const result = await pool.query(
            "INSERT INTO usuarios (nombre, correo, contrasena, tipo_usuario) VALUES ($1, $2, $3, $4) RETURNING *",
            [nombre, correo, contrasena, tipo_usuario]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al registrar usuario");
    }
});

//Listar todos los usuarios
router.get("/", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM usuarios");
        res.json(result.rows);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al obtener usuarios");
    }
});

//Obtener un usuario por ID
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("SELECT * FROM usuarios WHERE id_usuario = $1", [id]);
        if (result.rows.length === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al obtener usuario");
    }
});

//Actualizar usuario
router.put("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, email } = req.body;
        const result = await pool.query(
            "UPDATE usuarios SET nombre = $1, email = $2 WHERE id_usuario = $3 RETURNING *",
            [nombre, email, id]
        );
        if (result.rows.length === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al actualizar usuario");
    }
});

//Eliminar usuario
router.delete("/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const result = await pool.query("DELETE FROM usuarios WHERE id_usuario = $1 RETURNING *", [id]);
        if (result.rows.length === 0) {
            return res.status(404).send("Usuario no encontrado");
        }
        res.json({ mensaje: "Usuario eliminado", usuario: result.rows[0] });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al eliminar usuario");
    }
});

module.exports = router;
