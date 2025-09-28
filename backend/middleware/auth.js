const jwt = require("jsonwebtoken");
const JWT_SECRET = "mi_secreto_super_seguro";

function autenticar(req, res, next) {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    if (!token) return res.status(401).send("Acceso denegado, token faltante");

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.usuario = decoded; // info del usuario disponible en req.usuario
        next();
    } catch (err) {
        res.status(401).send("Token inválido");
    }
}

module.exports = autenticar;
