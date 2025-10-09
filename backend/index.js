/*const express = require("express");
const cors = require("cors");
const pool = require("./db/db");
const usuariosRouter = require("./routes/usuarios");
const serviciosRouter = require("./routes/servicios");
const citasRouter = require("./routes/citas");
const authRouter = require("./routes/auth");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    res.send("Servidor funcionando");
});
app.use("/api/usuarios", usuariosRouter);
app.use("/api/servicios", serviciosRouter);
app.use("/api/citas", citasRouter);
app.use("/api/auth", authRouter);
app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
*/

const express = require("express");
const cors = require("cors");
const pool = require("./db/db"); // <-- esto está bien
const usuariosRouter = require("./routes/usuarios");
const serviciosRouter = require("./routes/servicios");
const citasRouter = require("./routes/citas");
const authRouter = require("./routes/auth");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
res.send("Servidor funcionando");
});

app.use("/api/usuarios", usuariosRouter);
app.use("/api/servicios", serviciosRouter);
app.use("/api/citas", citasRouter);
app.use("/api/auth", authRouter);

app.get("/test-db", async (req, res) => {
    try {
    const result = await pool.query("SELECT NOW()");
    res.json(result.rows[0]);
    } catch (error) {
    console.error("Error de conexión:", error);
    res.status(500).json({ error: "No se pudo conectar a la base de datos" });
    }
});


app.listen(PORT, () => {
console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
