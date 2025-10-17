import express from "express";
import cors from "cors";
import usuariosRouter from "./routes/usuarios.js";
import serviciosRouter from "./routes/servicios.js";
import citasRouter from "./routes/citas.js";
import authRouter from "./routes/auth.js";


const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Servidor funcionando"));

app.use("/api/usuarios", usuariosRouter);
app.use("/api/servicios", serviciosRouter);
app.use("/api/citas", citasRouter);
app.use("/api/auth", authRouter);
app.use("/api/emprendimientos", (await import("./routes/emprendimientos.js")).default);

app.listen(PORT, () => console.log(`Servidor corriendo en http://localhost:${PORT}`));
