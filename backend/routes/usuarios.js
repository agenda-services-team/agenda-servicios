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
            { 
                id_usuario: usuario.id_usuario, 
                nombre: usuario.nombre, 
                tipo_usuario: usuario.tipo_usuario,
                correo: usuario.correo
            },
            JWT_SECRET,
            { expiresIn: "2h" }
        );

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
        console.error("Error en login:", err.message);
        res.status(500).send("Error en el login");
    }
});

// ========== ENDPOINTS AUTENTICADOS ==========

// 🆕 Obtener perfil de usuario
router.get("/:id", autenticar, async (req, res) => {  // ✅ QUITÉ soloProveedores
    try {
        const { id } = req.params;
        
        // Verificar que el usuario solo pueda ver su propio perfil
        if (parseInt(id) !== req.usuario.id_usuario) {
            return res.status(403).json({ error: "No tienes permiso para ver este perfil" });
        }

        const { data, error } = await supabase
            .from("usuarios")
            .select("id_usuario, nombre, correo, telefono, tipo_usuario, fecha_registro")
            .eq("id_usuario", id)
            .single();

        if (error || !data) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json(data);
        
    } catch (error) {
        console.error("Error al obtener usuario:", error.message);
        res.status(500).json({ error: "Error al obtener usuario" });
    }
});

// 🆕 Actualizar perfil de usuario
router.put("/:id", autenticar, async (req, res) => {
    try {
        const { id } = req.params;
        const { nombre, telefono } = req.body;

        // Verificar que el usuario solo pueda actualizar su propio perfil
        if (parseInt(id) !== req.usuario.id_usuario) {
            return res.status(403).json({ error: "No tienes permiso para actualizar este perfil" });
        }

        if (!nombre) {
            return res.status(400).json({ error: "El nombre es obligatorio" });
        }

        const { data, error } = await supabase
            .from("usuarios")
            .update({ 
                nombre: nombre.trim(),
                telefono: telefono ? telefono.trim() : null
            })
            .eq("id_usuario", id)
            .select("id_usuario, nombre, correo, telefono, tipo_usuario, fecha_registro");

        if (error) throw error;

        if (!data || data.length === 0) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        res.json({ 
            mensaje: "Perfil actualizado correctamente", 
            usuario: data[0] 
        });
        
    } catch (error) {
        console.error("Error al actualizar usuario:", error.message);
        res.status(500).json({ error: "Error al actualizar usuario" });
    }
});

// 🆕 Obtener estadísticas del usuario
router.get("/:id/estadisticas", autenticar, async (req, res) => {
    try {
        const { id } = req.params;

        // Verificar permisos
        if (parseInt(id) !== req.usuario.id_usuario) {
            return res.status(403).json({ error: "No tienes permiso para ver estas estadísticas" });
        }

        let estadisticas = {};

        if (req.usuario.tipo_usuario === 'cliente') {
            // Estadísticas para clientes
            const { data: citas, error: errorCitas } = await supabase
                .from("citas")
                .select("estado")
                .eq("id_cliente", id);

            if (!errorCitas) {
                const totalCitas = citas.length;
                const completadas = citas.filter(c => c.estado === 'completada').length;
                
                estadisticas = {
                    citasTotales: totalCitas,
                    citasCompletadas: completadas,
                    citasPendientes: totalCitas - completadas,
                    calificacionPromedio: "N/A"
                };
            }
        } else if (req.usuario.tipo_usuario === 'proveedor') {
            // Estadísticas para proveedores
            const { data: emprendimiento, error: errorEmp } = await supabase
                .from("emprendimientos")
                .select("id_emprendimiento")
                .eq("id_usuario", id)
                .single();

            if (!errorEmp && emprendimiento) {
                const { data: servicios, error: errorServ } = await supabase
                    .from("servicios")
                    .select("id_servicio")
                    .eq("id_emprendimiento", emprendimiento.id_emprendimiento);

                const { data: citas, error: errorCitas } = await supabase
                    .from("citas")
                    .select("estado")
                    .eq("id_servicio", servicios?.map(s => s.id_servicio) || []);

                if (!errorServ && !errorCitas) {
                    const totalCitas = citas.length;
                    const pendientes = citas.filter(c => c.estado === 'pendiente').length;
                    
                    estadisticas = {
                        totalServicios: servicios.length,
                        citasTotales: totalCitas,
                        citasPendientes: pendientes,
                        citasCompletadas: totalCitas - pendientes
                    };
                }
            }
        }

        res.json(estadisticas);
        
    } catch (error) {
        console.error("Error al obtener estadísticas:", error.message);
        res.status(500).json({ error: "Error al obtener estadísticas" });
    }
});

// 🆕 Cambiar contraseña
router.put("/:id/cambiar-password", autenticar, async (req, res) => {
    try {
        const { id } = req.params;
        const { contrasena_actual, nueva_contrasena } = req.body;

        // Verificar permisos
        if (parseInt(id) !== req.usuario.id_usuario) {
            return res.status(403).json({ error: "No tienes permiso para realizar esta acción" });
        }

        if (!contrasena_actual || !nueva_contrasena) {
            return res.status(400).json({ error: "Ambas contraseñas son obligatorias" });
        }

        // Obtener usuario actual
        const { data: usuario, error: errorUser } = await supabase
            .from("usuarios")
            .select("contrasena")
            .eq("id_usuario", id)
            .single();

        if (errorUser || !usuario) {
            return res.status(404).json({ error: "Usuario no encontrado" });
        }

        // Verificar contraseña actual
        const isMatch = await bcrypt.compare(contrasena_actual, usuario.contrasena);
        if (!isMatch) {
            return res.status(400).json({ error: "La contraseña actual es incorrecta" });
        }

        // Hashear nueva contraseña
        const hashedNueva = await bcrypt.hash(nueva_contrasena, 10);

        // Actualizar contraseña
        const { error } = await supabase
            .from("usuarios")
            .update({ contrasena: hashedNueva })
            .eq("id_usuario", id);

        if (error) throw error;

        res.json({ mensaje: "Contraseña actualizada correctamente" });
        
    } catch (error) {
        console.error("Error al cambiar contraseña:", error.message);
        res.status(500).json({ error: "Error al cambiar contraseña" });
    }
});

export default router;