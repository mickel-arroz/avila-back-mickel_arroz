import { Router } from "express";
import { authenticateJWT } from "../middlewares/auth.middleware";
import { OrderController } from "../controllers/order.controller";

const router = Router();

/**
 * @swagger
 * tags:
 *   - name: Pedidos
 *     description: Endpoints para gestión de pedidos de usuarios autenticados
 */

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Crear un nuevo pedido
 *     tags: [Pedidos]
 *     security:
 *       - apiAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [product, quantity]
 *                   properties:
 *                     product:
 *                       type: string
 *                       example: "663ecf8022bc1c31201e6077"
 *                     quantity:
 *                       type: integer
 *                       example: 2
 *     responses:
 *       201:
 *         description: Pedido creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Datos del pedido inválidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post("/", authenticateJWT, OrderController.createOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Obtener el historial de pedidos del usuario autenticado
 *     tags: [Pedidos]
 *     security:
 *       - apiAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Página de resultados (por defecto 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Número de pedidos por página (por defecto 10)
 *     responses:
 *       200:
 *         description: Historial de pedidos
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Order'
 *       401:
 *         description: Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error al recuperar pedidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/", authenticateJWT, OrderController.getMyOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Obtener un pedido por ID (solo si pertenece al usuario)
 *     tags: [Pedidos]
 *     security:
 *       - apiAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID del pedido
 *     responses:
 *       200:
 *         description: Pedido encontrado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       401:
 *         description: Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Pedido no encontrado o no autorizado
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno al buscar pedido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get("/:id", authenticateJWT, OrderController.getOrderById);

/**
 * @swagger
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Cambiar el estado de una orden
 *     security:
 *       - apiAuth: []
 *     tags:
 *       - Pedidos
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: ID de la orden
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [status]
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pendiente, procesado, enviado, entregado, cancelado]
 *                 example: procesado
 *                 description: "Nuevo estado de la orden. Valores permitidos: pendiente, procesado, enviado, entregado, cancelado."
 *     responses:
 *       200:
 *         description: Estado actualizado correctamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: Estado inválido o error de validación
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       401:
 *         description: Token no proporcionado o inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       404:
 *         description: Orden no encontrada
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       500:
 *         description: Error interno del servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.patch("/:id/status", authenticateJWT, OrderController.updateOrderStatus);

export default router;
