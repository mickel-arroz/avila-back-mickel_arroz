import { OrderService } from "../order.service";
import { OrderModel } from "../../models/order.model";
import { Product } from "../../models/product.model";
import mongoose from "mongoose";

jest.mock("../../models/order.model");
jest.mock("../../models/product.model");
jest.mock("mongoose", () => {
  const actualMongoose = jest.requireActual("mongoose");
  return {
    ...actualMongoose,
    startSession: jest.fn(),
    Types: {
      ObjectId: {
        isValid: jest.fn().mockReturnValue(true),
      },
    },
  };
});

const mockSession = {
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  abortTransaction: jest.fn(),
  endSession: jest.fn(),
};

describe("OrderService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (mongoose.startSession as jest.Mock).mockResolvedValue(mockSession);
  });

  describe("createOrder", () => {
    it("debe crear una nueva orden correctamente", async () => {
      const mockProduct = {
        _id: "product123",
        stock: 10,
        save: jest.fn(),
        session: jest.fn().mockReturnThis(),
      };

      (Product.findById as jest.Mock).mockReturnValue({
        session: jest.fn().mockResolvedValue(mockProduct),
      });

      (OrderModel.create as jest.Mock).mockResolvedValue([
        {
          _id: "order123",
          user: "user123",
          items: [],
          status: "pendiente",
        },
      ]);

      const result = await OrderService.createOrder("user123", [
        { product: "product123", quantity: 2 },
      ]);

      expect(result._id).toBe("order123");
      expect(OrderModel.create).toHaveBeenCalled();
    }, 10000);

    it("debe lanzar error si el producto no existe", async () => {
      (Product.findById as jest.Mock).mockReturnValue({
        session: jest.fn().mockResolvedValue(null),
      });

      await expect(
        OrderService.createOrder("user123", [
          { product: "product123", quantity: 2 },
        ])
      ).rejects.toThrow("Producto no encontrado");
    });

    it("debe lanzar error si no hay suficiente stock", async () => {
      const mockProduct = {
        stock: 1,
        session: jest.fn().mockReturnThis(),
      };

      (Product.findById as jest.Mock).mockReturnValue({
        session: jest.fn().mockResolvedValue(mockProduct),
      });

      await expect(
        OrderService.createOrder("user123", [
          { product: "product123", quantity: 5 },
        ])
      ).rejects.toThrow("Stock insuficiente");
    });

    it("debe abortar la transacción si ocurre un error inesperado", async () => {
      (Product.findById as jest.Mock).mockImplementation(() => {
        throw new Error("fallo inesperado");
      });

      await expect(
        OrderService.createOrder("user123", [
          { product: "product123", quantity: 2 },
        ])
      ).rejects.toThrow("Error interno al crear el pedido");

      expect(mockSession.abortTransaction).toHaveBeenCalled();
    });
  });

  describe("updateOrderStatus", () => {
    it("debe restaurar el stock si se cancela la orden", async () => {
      const mockOrder = {
        status: "pendiente",
        items: [
          {
            product: {
              _id: "product123",
            },
            quantity: 2,
          },
        ],
        save: jest.fn(),
      };

      (OrderModel.findById as jest.Mock).mockReturnValue({
        populate: jest.fn().mockResolvedValue(mockOrder),
      });

      (Product.bulkWrite as jest.Mock).mockResolvedValue({});

      const result = await OrderService.updateOrderStatus(
        "order123",
        "cancelado"
      );

      expect(Product.bulkWrite).toHaveBeenCalledWith([
        {
          updateOne: {
            filter: { _id: "product123" },
            update: { $inc: { stock: 2 } },
          },
        },
      ]);
      expect(result.status).toBe("cancelado");
    });
  });
});
