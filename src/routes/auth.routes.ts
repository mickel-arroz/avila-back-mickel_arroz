import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.post("/register", AuthController.register);
router.post("/login", AuthController.login);

// Para pruebas internas:
router.get("/users", AuthController.getAllUsers);

export default router;
