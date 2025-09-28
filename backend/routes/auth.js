const express = require("express");
const pool = require("../db/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const JWT_SECRET = "mi_secreto_super_seguro";

//Registro de usuario
router.post("/register", async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;

        // Verificar que no exista el correo
        const existe = await pool.query("SELECT * FROM usuarios WHERE correo = $1", [correo]);
        if (existe.rows.length > 0) {
            return res.status(400).send("Correo ya registrado");
        }

        // Encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Guardar usuario
        const result = await pool.query(
            "INSERT INTO usuarios (nombre, correo, password) VALUES ($1, $2, $3) RETURNING id_usuario, nombre, correo",
            [nombre, correo, hashedPassword]
        );

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error en el registro");
    }
});

//Login de usuario
router.post("/login", async (req, res) => {
    try {
        const { correo, password } = req.body;

        // Buscar usuario
        const result = await pool.query("SELECT * FROM usuarios WHERE correo = $1", [correo]);
        if (result.rows.length === 0) {
            return res.status(400).send("Correo o contraseña incorrectos");
        }

        const usuario = result.rows[0];

        // Comparar contraseña
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            return res.status(400).send("Correo o contraseña incorrectos");
        }

        // Generar token JWT
        const token = jwt.sign(
            { id_usuario: usuario.id_usuario, nombre: usuario.nombre },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

        res.json({ token });
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error en el login");
    }
});

module.exports = router;
