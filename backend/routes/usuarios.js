import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabaseClient.js";


const router = express.Router();

const JWT_SECRET = "mi_contraseña_secreta";

//Registro de usuario
router.post("/registro", async (req, res) => {
    console.log("🔔 Registro request body:", req.body);
    try {
        const { nombre, correo, contrasena, telefono, tipo_usuario } = req.body;

        // Verificar si ya existe el correo
        const { data: existe, error: errorExiste } = await supabase
            .from("usuarios")
            .select("*")
            .eq("correo", correo);

        if (errorExiste) throw errorExiste;
        if (existe.length > 0) return res.status(400).send("Correo ya registrado");

        const hashed = await bcrypt.hash(contrasena, 10);

        // Insertar nuevo usuario
        const { data, error } = await supabase
            .from("usuarios")
            .insert([
                {
                    nombre,
                    correo,
                    contrasena: hashed,
                    telefono,
                    tipo_usuario,
                    fecha_registro: new Date()
                }
            ])
            .select();

        if (error) throw error;

        res.json({ mensaje: "Usuario registrado con éxito", usuario: data[0] });
    } catch (err) {
        console.error("❌ Error en registro:", err.message);
        res.status(500).send("Error en el registro");
    }
});

// Login de usuario
router.post("/login", async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        const { data, error } = await supabase
            .from("usuarios")
            .select("*")
            .eq("correo", correo);

        if (error) throw error;
        if (data.length === 0) return res.status(400).send("Correo o contraseña incorrectos");

        const usuario = data[0];
        const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!isMatch) return res.status(400).send("Correo o contraseña incorrectos");

        const token = jwt.sign(
            { id_usuario: usuario.id_usuario, nombre: usuario.nombre, tipo_usuario: usuario.tipo_usuario },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

        //Se modifica la respuesta para incluir datos del usuario
        res.json({ token, usuario: { id_usuario: usuario.id_usuario, nombre: usuario.nombre, tipo_usuario: usuario.tipo_usuario } });
    } catch (err) {
        console.error("❌ Error en login:", err.message);
        res.status(500).send("Error en el login");
    }
});

export default router;
