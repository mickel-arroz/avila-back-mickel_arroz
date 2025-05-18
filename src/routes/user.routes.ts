// src/routes/user.routes.ts
import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/authorize.middleware";

const router = Router();

router.use(authenticateJWT, authorizeRoles("admin"));

router.get("/", UserController.getAllUsers);

router.put("/:email", UserController.updateUserEmail);

router.patch("/:email/role", UserController.updateUserRole);

router.patch("/:email/password", UserController.changePassword);

router.delete("/:email", UserController.deleteUser);

export default router;
