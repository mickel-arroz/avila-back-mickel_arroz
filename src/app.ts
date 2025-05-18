import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Home de la API REST de comercio electronico escalable");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);

app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

export default app;
