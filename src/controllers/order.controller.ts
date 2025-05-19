import { Request, Response } from "express";
import { z } from "zod";
import { OrderService } from "../services/order.service";
import { formatZodError } from "../utils/error.utils";

const CreateOrderSchema = z.object({
  items: z
    .array(
      z.object({
        product: z.string(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});

export const OrderController = {
  createOrder: async (req: Request, res: Response) => {
    const parse = CreateOrderSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({
        errorType: "VALIDATION_ERROR",
        message: "Datos inválidos para el pedido",
        details: formatZodError(parse.error),
      });
      return;
    }

    try {
      const userId = req.user?.id;
      const order = await OrderService.createOrder(userId, parse.data.items);
      res.status(201).json(order);
      return;
    } catch (err: any) {
      res.status(500).json({
        errorType: "SERVER_ERROR",
        message: "Error al procesar pedido",
        details: err.message,
      });
      return;
    }
  },

  getMyOrders: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await OrderService.getOrdersByUser(userId, page, limit);

      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({
        errorType: "SERVER_ERROR",
        message: "Error al obtener historial de pedidos",
        details: err.message,
      });
    }
  },

  getOrderById: async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id; // agregado por el middleware authenticateJWT
      const orderId = req.params.id;

      const order = await OrderService.getOrderById(orderId, userId);

      res.status(200).json(order);
      return;
    } catch (error: any) {
      try {
        const parsed = JSON.parse(error.message);
        res.status(parsed.statusCode || 400).json(parsed);
        return;
      } catch {
        res.status(500).json({
          errorType: "INTERNAL_SERVER_ERROR",
          message: "Error al obtener el pedido",
        });
        return;
      }
    }
  },

  updateOrderStatus: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      res.status(400).json({
        errorType: "VALIDATION_ERROR",
        message: "El nuevo estado es requerido",
        details: { status },
      });
      return;
    }

    try {
      const updatedOrder = await OrderService.updateOrderStatus(id, status);
      res.status(200).json(updatedOrder);
    } catch (error: any) {
      if (error.message === "ORDER_NOT_FOUND") {
        res.status(404).json({
          errorType: "ORDER_NOT_FOUND",
          message: "Orden no encontrada",
          details: { orderId: id },
        });
        return;
      }

      if (error.message === "INVALID_STATUS") {
        res.status(400).json({
          errorType: "INVALID_STATUS",
          message: "Estado de orden no válido",
          details: { received: status },
        });
        return;
      }

      res.status(500).json({
        errorType: "INTERNAL_SERVER_ERROR",
        message: "Error al actualizar el estado de la orden",
        details: error.message,
      });
    }
  },
};
