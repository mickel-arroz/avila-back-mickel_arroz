import { OrderModel } from "../models/order.model";
import { Product } from "../models/product.model";
import mongoose from "mongoose";

import { OrderStatus } from "../types/order-status";

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
        if (!product || product.stock < item.quantity) {
          throw new Error(
            `Producto no disponible o stock insuficiente: ${item.product}`
          );
        }

        product.stock -= item.quantity;
        await product.save({ session });

        orderItems.push({
          product: item.product,
          quantity: item.quantity,
        });
      }

      const newOrder = await OrderModel.create(
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
      return newOrder[0];
    } catch (err) {
      await session.abortTransaction();
      throw err;
    } finally {
      session.endSession();
    }
  },

  getOrdersByUser: async (userId: string) => {
    return await OrderModel.find({ user: userId }).populate("items.product");
  },

  getOrderById: async (orderId: string, userId: string) => {
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      throw new Error(
        JSON.stringify({
          statusCode: 400,
          errorType: "INVALID_ORDER_ID",
          message: "El ID del pedido no es válido",
          details: { orderId },
        })
      );
    }

    const order = await OrderModel.findById(orderId).populate("items.product");

    if (!order) {
      throw new Error(
        JSON.stringify({
          statusCode: 404,
          errorType: "ORDER_NOT_FOUND",
          message: "Pedido no encontrado",
          details: { orderId },
        })
      );
    }

    if (order.user.toString() !== userId) {
      throw new Error(
        JSON.stringify({
          statusCode: 403,
          errorType: "FORBIDDEN",
          message: "No tienes acceso a este pedido",
          details: { orderId, userId },
        })
      );
    }

    return order;
  },

  updateOrderStatus: async (orderId: string, newStatus: string) => {
    if (!validStatuses.includes(newStatus as OrderStatus)) {
      throw new Error("INVALID_STATUS");
    }

    const order = await OrderModel.findById(orderId).populate("items.product");
    if (!order) {
      throw new Error("ORDER_NOT_FOUND");
    }

    if (order.status === "cancelado") {
      throw new Error("ORDER_ALREADY_CANCELLED");
    }

    // si se cancela, devolvemos el stock
    if (newStatus === "cancelado") {
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock += item.quantity;
          await product.save();
        }
      }
    }

    order.status = newStatus as OrderStatus;
    await order.save();

    return order;
  },
};
