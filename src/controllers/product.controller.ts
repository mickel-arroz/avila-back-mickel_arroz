import { Request, Response } from "express";
import { z } from "zod";
import { formatZodError } from "../utils/error.utils";
import { ProductService } from "../services/product.service";
import { ApiError } from "../utils/apiError";

const CreateProductSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  price: z.number().nonnegative(),
  stock: z.number().int().nonnegative(),
});

const UpdateProductSchema = z
  .object({
    name: z.string().min(1).optional(),
    description: z.string().min(1).optional(),
    price: z.number().nonnegative().optional(),
    stock: z.number().int().nonnegative().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "Debe enviar al menos un campo a actualizar",
  });

export const ProductController = {
  createProduct: async (req: Request, res: Response) => {
    const parse = CreateProductSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({
        errorType: "VALIDATION_ERROR",
        message: "Datos de producto inválidos",
        details: formatZodError(parse.error),
      });
      return;
    }

    try {
      const product = await ProductService.createProduct(parse.data);
      res.status(201).json(product);
    } catch (err: any) {
      if (err instanceof ApiError) {
        res.status(err.statusCode).json({
          errorType: err.errorType,
          message: err.message,
          details: err.details,
        });
        return;
      }

      res.status(500).json({
        errorType: "SERVER_ERROR",
        message: "Error al crear producto",
        details: err.message,
      });
    }
  },

  getProductsStock: async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;

    try {
      const result = await ProductService.getProducts({ page, limit });
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({
        errorType: "SERVER_ERROR",
        message: "Error al obtener productos",
        details: err.message,
      });
    }
  },

  getProducts: async (req: Request, res: Response) => {
    const page = req.query.page
      ? parseInt(req.query.page as string, 10)
      : undefined;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : undefined;

    try {
      const result = await ProductService.getProductsAll({ page, limit });
      res.status(200).json(result);
    } catch (err: any) {
      res.status(500).json({
        errorType: "SERVER_ERROR",
        message: "Error al obtener productos",
        details: err.message,
      });
    }
  },

  getProduct: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const result = await ProductService.getProduct(id);
      res.status(200).json(result);
    } catch (err: any) {
      if (err instanceof ApiError) {
        res.status(err.statusCode).json({
          errorType: err.errorType,
          message: err.message,
          details: err.details,
        });
        return;
      }

      res.status(500).json({
        errorType: "SERVER_ERROR",
        message: "Error al obtener producto",
        details: err.message,
      });
    }
  },

  updateProduct: async (req: Request, res: Response) => {
    const { id } = req.params;

    const parse = UpdateProductSchema.safeParse(req.body);
    if (!parse.success) {
      res.status(400).json({
        errorType: "VALIDATION_ERROR",
        message: "Datos de actualización inválidos",
        details: formatZodError(parse.error),
      });
      return;
    }

    try {
      const updated = await ProductService.updateProduct(id, parse.data);
      res.status(200).json(updated);
    } catch (err: any) {
      if (err instanceof ApiError) {
        res.status(err.statusCode).json({
          errorType: err.errorType,
          message: err.message,
          details: err.details,
        });
        return;
      }

      res.status(500).json({
        errorType: "SERVER_ERROR",
        message: "Error al actualizar producto",
        details: err.message,
      });
    }
  },

  deleteProduct: async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
      const result = await ProductService.deleteProduct(id);
      res.status(200).json(result);
    } catch (err: any) {
      if (err instanceof ApiError) {
        res.status(err.statusCode).json({
          errorType: err.errorType,
          message: err.message,
          details: err.details,
        });
        return;
      }

      res.status(500).json({
        errorType: "SERVER_ERROR",
        message: "Error al eliminar producto",
        details: err.message,
      });
    }
  },
};
