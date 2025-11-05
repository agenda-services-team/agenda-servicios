import jwt from "jsonwebtoken";
import { supabase } from "../config/supabaseClient.js"; //se importa el cliente de supabse

const JWT_SECRET = "mi_contraseña_secreta";

export async function autenticar(req, res, next) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).send("Acceso denegado, token faltante");

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded;

        // Se obtiene el id_emprendimiento del usuario (si es proveedor)
        if (req.usuario.tipo_usuario === "proveedor") {
            const { data, error } = await supabase
                .from('emprendimientos')
                .select('id_emprendimiento')
                .eq('id_proveedor', req.usuario.id_usuario)
                .single();
            if (!error && data) {
                req.usuario.id_emprendimiento = data.id_emprendimiento;
            } else {
                req.usuario.id_emprendimiento = null; // 
            }
        }
        next();
    } catch (err) {
        res.status(401).send("Token inválido");
    }
}
