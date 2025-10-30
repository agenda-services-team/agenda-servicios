import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { supabase } from "../config/supabaseClient.js";
import { autenticar } from "../middleware/auth.js";

const router = express.Router();
const JWT_SECRET = "mi_contraseña_secreta";

// ========== ENDPOINTS PÚBLICOS ==========

// Registro de usuario
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
        if (existe.length > 0) {
            return res.status(400).json({ mensaje: "El correo ya está registrado" });
        }

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
        res.status(500).json({ mensaje: "Error en el registro" });
    }
});

// Login de usuario - CORREGIDO
router.post("/login", async (req, res) => {
    try {
        const { correo, contrasena } = req.body;

        console.log('🔐 Intento de login:', { correo });

        // Buscar usuario por correo
        const { data, error } = await supabase
            .from("usuarios")
            .select("*")
            .eq("correo", correo);

        if (error) {
            console.error('Error en query:', error);
            throw error;
        }

        if (!data || data.length === 0) {
            console.log('❌ Usuario no encontrado');
            return res.status(401).json({ mensaje: "Credenciales incorrectas" });
        }

        const usuario = data[0];
        console.log('👤 Usuario encontrado:', { 
            id: usuario.id_usuario, 
            tipo: usuario.tipo_usuario 
        });

        // Verificar contraseña
        const isMatch = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!isMatch) {
            console.log('❌ Contraseña incorrecta');
            return res.status(401).json({ mensaje: "Credenciales incorrectas" });
        }

        // Generar token JWT
        const token = jwt.sign(
            { 
                id_usuario: usuario.id_usuario, 
                nombre: usuario.nombre, 
                tipo_usuario: usuario.tipo_usuario,
                correo: usuario.correo
            },
            JWT_SECRET,
            { expiresIn: "24h" }
        );

        console.log('✅ Login exitoso');

        // Retornar datos del usuario (sin contraseña)
        res.json({ 
            token, 
            usuario: { 
                id_usuario: usuario.id_usuario, 
                nombre: usuario.nombre, 
                tipo_usuario: usuario.tipo_usuario,
                correo: usuario.correo,
                telefono: usuario.telefono,
                fecha_registro: usuario.fecha_registro
            } 
        });

    } catch (err) {
        console.error("❌ Error en login:", err);
        res.status(500).json({ mensaje: "Error en el servidor" });
    }
});

// ========== ENDPOINTS AUTENTICADOS ==========

// Obtener perfil de usuario
router.get('/perfil/:id', autenticar, async (req, res) => {
    try {
        const { data: usuario, error } = await supabase
            .from('usuarios')
            .select('id_usuario, nombre, correo, telefono, tipo_usuario')
            .eq('id_usuario', req.params.id)
            .single();

        if (error) throw error;
        if (!usuario) {
            return res.status(404).json({ mensaje: 'Usuario no encontrado' });
        }

        res.json(usuario);
    } catch (error) {
        console.error('Error al obtener perfil:', error);
        res.status(500).json({ mensaje: 'Error al obtener perfil' });
    }
});

// Actualizar perfil de usuario
router.put("/:id", autenticar, async (req, res) => {
    const { nombre, telefono } = req.body;

    try {
        const { data, error } = await supabase
            .from('usuarios')
            .update({ 
                nombre, 
                telefono
            })
            .eq('id_usuario', req.params.id)
            .select();

        if (error) throw error;

        res.json(data[0]);
    } catch (error) {
        console.error('Error al actualizar perfil:', error);
        res.status(500).json({ mensaje: 'Error al actualizar perfil' });
    }
});

// Obtener estadísticas del usuario
router.get("/:id/estadisticas", autenticar, async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id_usuario', id)
            .single();

        if (error) throw error;

        res.json(data);
    } catch (error) {
        console.error('Error al obtener estadísticas:', error);
        res.status(500).json({ mensaje: 'Error al obtener estadísticas' });
    }
});

// Cambiar contraseña
router.put("/:id/cambiar-password", autenticar, async (req, res) => {
    try {
        const { id } = req.params;
        const { passwordActual, passwordNueva } = req.body;

        // Obtener usuario actual
        const { data: usuario, error: errorUsuario } = await supabase
            .from('usuarios')
            .select('contrasena')
            .eq('id_usuario', id)
            .single();

        if (errorUsuario) throw errorUsuario;

        // Verificar contraseña actual
        const isMatch = await bcrypt.compare(passwordActual, usuario.contrasena);
        if (!isMatch) {
            return res.status(400).json({ mensaje: 'Contraseña actual incorrecta' });
        }

        // Hash de la nueva contraseña
        const hashedNew = await bcrypt.hash(passwordNueva, 10);

        // Actualizar contraseña
        const { error } = await supabase
            .from('usuarios')
            .update({ contrasena: hashedNew })
            .eq('id_usuario', id);

        if (error) throw error;

        res.json({ mensaje: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error('Error al cambiar contraseña:', error);
        res.status(500).json({ mensaje: 'Error al cambiar contraseña' });
    }
});

export default router;