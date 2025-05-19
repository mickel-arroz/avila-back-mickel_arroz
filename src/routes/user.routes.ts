// src/routes/user.routes.ts
import { Router } from "express";
import { UserController } from "../controllers/user.controller";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { authorizeRoles } from "../middlewares/authorize.middleware";

const router = Router();

// Aplicar autenticación y autorización (solo admin)
router.use(authenticateJWT, authorizeRoles("admin"));

/**
 * @swagger
 * tags:
 *   - name: Users
 *     description: Gestión de usuarios (solo administradores)
 */

/**
 * @swagger
 * /api/user:
 *   get:
 *     summary: Obtener listado de usuarios registrados
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Listado de usuarios obtenido con éxito
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       400:
 *         description: Error de validación de campos
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", UserController.getAllUsers);

/**
 * @swagger
 * /api/user/{email}:
 *   put:
 *     summary: Actualizar datos de un usuario por email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email del usuario cuyo email se actualizará
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             description: Campos permitidos para actualizar (no _id, password, createdAt)
 *             properties:
 *               email:
 *                 type: string
 *                 example: newmail@example.com
 *
 *             additionalProperties: false
 *     responses:
 *       200:
 *         description: Usuario actualizado correctamente
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/User'
 *       400:
 *         description: Validación de datos inválida o campos prohibidos
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ErrorResponse'
 */
router.put("/:email", UserController.updateUserEmail);

/**
 * @swagger
 * /api/user/{email}/role:
 *   patch:
 *     summary: Cambiar rol de un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email del usuario cuyo rol se actualizará
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [role]
 *             properties:
 *               role:
 *                 type: string
 *                 enum: [user, admin]
 *                 example: admin
 *     responses:
 *       200:
 *         description: Rol de usuario actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *                 message:
 *                   type: string
 *                   example: Rol de usuario actualizado correctamente
 *       400:
 *         description: Validación de datos inválida
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:email/role", UserController.updateUserRole);

/**
 * @swagger
 * /api/user/{email}/password:
 *   patch:
 *     summary: Cambiar contraseña de un usuario
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email del usuario cuya contraseña se actualizará
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: NuevaPass456
 *     responses:
 *       200:
 *         description: Contraseña actualizada correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: Contraseña actualizada correctamente
 *       400:
 *         description: Validación de datos inválida o nueva contraseña igual a la anterior
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:email/password", UserController.changePassword);

/**
 * @swagger
 * /api/user/{email}:
 *   delete:
 *     summary: Eliminar un usuario por email
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: email
 *         required: true
 *         schema:
 *           type: string
 *           format: email
 *         description: Email del usuario a eliminar
 *     responses:
 *       200:
 *         description: Usuario eliminado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: user@example.com
 *                     role:
 *                       type: string
 *                       example: user
 *                     deletedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-05-13T14:30:00.000Z"
 *                 message:
 *                   type: string
 *                   example: Usuario eliminado correctamente
 *       400:
 *         description: Validación de datos inválida o intento de auto-eliminación
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Usuario no encontrado
 *         content:
 *           application/json:
 *             $ref: '#/components/schemas/ErrorResponse'
 */
router.delete("/:email", UserController.deleteUser);

export default router;
