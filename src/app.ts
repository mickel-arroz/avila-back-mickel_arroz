import express from "express";
import authRoutes from "./routes/auth.routes";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

app.use("/api/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Home de la API REST de comercio electronico escalable");
});

export default app;
