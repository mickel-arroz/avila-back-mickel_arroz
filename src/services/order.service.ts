import { OrderModel } from "../models/order.model";
import { Product } from "../models/product.model";
import mongoose from "mongoose";
import { OrderStatus } from "../types/order-status";
import { ApiError } from "../utils/apiError";

const validStatuses: OrderStatus[] = [
  "pendiente",
  "procesado",
  "enviado",
  "entregado",
  "cancelado",
];

export const OrderService = {
  createOrder: async (
    userId: string,
    items: { product: string; quantity: number }[]
  ) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const orderItems = [];

      for (const item of items) {
        const product = await Product.findById(item.product).session(session);
        if (!product) {
          throw new ApiError(
            404,
            `Producto no encontrado: ${item.product}`,
            "PRODUCT_NOT_FOUND"
          );
        }
        if (product.stock < item.quantity) {
          throw new ApiError(
            400,
            `Stock insuficiente para producto: ${item.product}`,
            "INSUFFICIENT_STOCK"
          );
        }

        product.stock -= item.quantity;
        await product.save({ session });

        orderItems.push({
          product: item.product,
          quantity: item.quantity,
        });
      }

      const [newOrder] = await OrderModel.create(
        [
          {
            user: userId,
            items: orderItems,
            status: "pendiente",
          },
        ],
        { session }
      );

      await session.commitTransaction();
      return newOrder;
    } catch (err) {
      await session.abortTransaction();
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        500,
        "Error interno al crear el pedido",
        "SERVER_ERROR",
        err
      );
    } finally {
      session.endSession();
    }
  },

  getOrdersByUser: async (
    userId: string,
    page: number = 1,
    limit: number = 10
  ) => {
    try {
      const skip = (page - 1) * limit;

      const [orders, total] = await Promise.all([
        OrderModel.find({ user: userId })
          .populate("items.product")
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        OrderModel.countDocuments({ user: userId }),
      ]);

      if (orders.length === 0) {
        throw new ApiError(404, "No se encontraron pedidos", "NO_ORDERS_FOUND");
      }

      return {
        success: true,
        total,
        page,
        limit,
        data: orders,
      };
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw new ApiError(
        500,
        "Error interno al obtener pedidos",
        "SERVER_ERROR",
        err
      );
    }
  },

  getOrderById: async (orderId: string, userId: string) => {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new ApiError(
        400,
        "El ID del pedido no es válido",
        "INVALID_ORDER_ID",
        { orderId }
      );
    }

    const order = await OrderModel.findById(orderId)
      .populate("items.product")
      .lean();

    if (!order) {
      throw new ApiError(404, "Pedido no encontrado", "ORDER_NOT_FOUND", {
        orderId,
      });
    }

    if (order.user.toString() !== userId) {
      throw new ApiError(403, "No tienes acceso a este pedido", "FORBIDDEN", {
        orderId,
        userId,
      });
    }

    return order;
  },

  updateOrderStatus: async (orderId: string, newStatus: string) => {
    if (!validStatuses.includes(newStatus as OrderStatus)) {
      throw new ApiError(400, "Estado de orden no válido", "INVALID_STATUS", {
        received: newStatus,
      });
    }

    const order = await OrderModel.findById(orderId).populate("items.product");
    if (!order) {
      throw new ApiError(404, "Orden no encontrada", "ORDER_NOT_FOUND", {
        orderId,
      });
    }

    if (order.status === "cancelado") {
      throw new ApiError(
        400,
        "La orden ya fue cancelada",
        "ORDER_ALREADY_CANCELLED",
        { orderId }
      );
    }

    if (newStatus === "cancelado") {
      const updates = order.items.map((item) => ({
        updateOne: {
          filter: { _id: item.product._id },
          update: { $inc: { stock: item.quantity } },
        },
      }));

      await Product.bulkWrite(updates);
    }

    order.status = newStatus as OrderStatus;
    await order.save();

    return order;
  },
};
