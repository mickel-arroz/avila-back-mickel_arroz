import { Request, Response, NextFunction } from "express";
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
  createOrder: async (req: Request, res: Response, next: NextFunction) => {
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
      const order = await OrderService.createOrder(userId!, parse.data.items);
      res.status(201).json(order);
    } catch (err) {
      next(err);
    }
  },

  getMyOrders: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const result = await OrderService.getOrdersByUser(userId!, page, limit);

      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  },

  getOrderById: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const orderId = req.params.id;

      const order = await OrderService.getOrderById(orderId, userId!);

      res.status(200).json(order);
    } catch (err) {
      next(err);
    }
  },

  updateOrderStatus: async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
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
    } catch (err) {
      next(err);
    }
  },
};
