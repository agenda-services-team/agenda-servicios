import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabaseClient.js";

import { autenticar } from "../middleware/auth.js";

const router = express.Router();
const JWT_SECRET = "mi_secreto_super_seguro";

// Registro de usuario
router.post("/register", async (req, res) => {
    try {
        const { nombre, correo, password } = req.body;

        // Con esto se verifica que no exista el correo
        const { data: existe, error: errorSelect } = await supabase
            .from("usuarios")
            .select("*")
            .eq("correo", correo);

        if (errorSelect) throw errorSelect;

        if (existe.length > 0)
            return res.status(400).send("Correo ya registrado");

        // Con esto se encriptar contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Guardar usuario
        const { data, error: errorInsert } = await supabase
            .from("usuarios")
            .insert([{ nombre, correo, password: hashedPassword }])
            .select();

        if (errorInsert) throw errorInsert;

        res.json(data[0]);
    } catch (err) {
        console.error(err.message);
        res.status(500).send("Error en el registro");
    }
});

// Login de usuario
router.post("/login", async (req, res) => {
    try {
        const { correo, password } = req.body;

        // Buscar usuario
        const { data: usuarios, error: errorSelect } = await supabase
            .from("usuarios")
            .select("*")
            .eq("correo", correo);

        if (errorSelect) throw errorSelect;

        if (!usuarios || usuarios.length === 0)
            return res.status(400).send("Correo o contraseña incorrectos");

        const usuario = usuarios[0];

        // Comparar contraseña
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch)
            return res.status(400).send("Correo o contraseña incorrectos");

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

export default router;

