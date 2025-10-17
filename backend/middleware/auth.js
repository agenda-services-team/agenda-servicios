import jwt from "jsonwebtoken";

const JWT_SECRET = "mi_contraseña_secreta";

export function autenticar(req, res, next) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).send("Acceso denegado, token faltante");

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded; // el  info del usuario esta  disponible en req.usuario
        next();
    } catch (err) {
        res.status(401).send("Token inválido");
    }
}
