import express from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { apiLimiter } from "./middlewares/rateLimiter";
import compression from "compression";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import ordersRoutes from "./routes/order.routes";

import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./swagger/swagger";

const app = express();
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Limitar peticiones a la API por la misma IP.
app.use("/api/", apiLimiter);

// Comprimir tamaño de respuestas HTTP (HTML,JSON,..)
app.use(compression());

app.get("/", (req, res) => {
  res.send("Home de la API REST de comercio electronico escalable");
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", ordersRoutes);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

export default app;
