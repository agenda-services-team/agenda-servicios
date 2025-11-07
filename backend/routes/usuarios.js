import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabaseClient.js";
import { autenticar } from "../middleware/auth.js"; // ✅ Importar middleware

const router = express.Router();

const JWT_SECRET = "mi_contraseña_secreta";

//Registro de usuario
router.post("/registro", async (req, res) => {
    console.log("Registro request body:", req.body);
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
        console.error("Error en registro:", err.message);
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
        console.error("Error en login:", err.message);
        res.status(500).send("Error en el login");
    }
});

// ✅ NUEVO ENDPOINT: Obtener perfil del usuario
router.get("/perfil/:id", autenticar, async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar que el usuario solo pueda ver su propio perfil
        if (parseInt(id) !== req.usuario.id_usuario) {
            return res.status(403).json({ error: "No autorizado" });
        }

        const { data, error } = await supabase
            .from("usuarios")
            .select("id_usuario, nombre, correo, telefono, fecha_registro, tipo_usuario")
            .eq("id_usuario", id)
            .single();

        if (error) throw error;
        if (!data) return res.status(404).json({ error: "Usuario no encontrado" });

        res.json(data);
    } catch (err) {
        console.error("Error al obtener perfil:", err.message);
        res.status(500).json({ error: "Error al obtener perfil" });
    }
});

export default router;
