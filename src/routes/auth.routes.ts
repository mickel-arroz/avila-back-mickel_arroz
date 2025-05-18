import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/authorize.middleware";

const router = Router();

// Rutas PÚBLICAS
router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Ruta PRIVADA (solo admin)
router.get(
  "/users",
  authenticateJWT,
  //   authorizeRoles("admin"),
  AuthController.getAllUsers
);

export default router;
