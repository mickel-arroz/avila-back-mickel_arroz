import express, { ErrorRequestHandler } from "express";
import "dotenv/config";
import cors from "cors";
import cookieParser from "cookie-parser";
import { apiLimiter } from "./middlewares/rateLimiter";
import compression from "compression";

import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import productRoutes from "./routes/product.routes";
import ordersRoutes from "./routes/order.routes";

import { errorHandler } from "./middlewares/errorHandler";

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
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>API REST</title>
        <style>
            body { font-family: Arial; margin: 40px; }
            h1 { color: #333; }
        </style>
    </head>
    <body>
        <h1>Home de la API REST de comercio electrónico escalable</h1>
        <p>Bienvenido a nuestra API</p>
        <strong><a href="/api/docs">Ir a la Documentacion de la API (Swagger UI)</a><strong>
    </body>
    </html>
  `);
});

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", ordersRoutes);

app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware de Gestion de Errores
app.use(errorHandler as ErrorRequestHandler);

export default app;
