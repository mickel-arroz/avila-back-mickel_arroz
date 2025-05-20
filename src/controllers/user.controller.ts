import { Request, Response } from "express";
import { z } from "zod";
import { formatZodError } from "../utils/error.utils";
import { UserService } from "../services/user.service";
import { ApiError } from "../utils/apiError";

const ChangePasswordSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const UserController = {
  getAllUsers: async (req: Request, res: Response) => {
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit
      ? parseInt(req.query.limit as string, 10)
      : 10;

    try {
      const result = await UserService.getAllUsers({ page, limit });
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof z.ZodError) {
        res.status(400).json({
          errorType: "VALIDATION_ERROR",
          message: "Validación fallida",
          details: formatZodError(error),
        });
        return;
      }

      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          errorType: error.errorType,
          message: error.message,
          details: error.details,
        });
        return;
      }

      res.status(500).json({
        errorType: "SERVER_ERROR",
        message: "Error al obtener usuarios",
        details: (error as Error).message,
      });
    }
  },

  updateUserEmail: async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const updateData = req.body;

      if (!email || typeof email !== "string") {
        throw new ApiError(
          400,
          "El parámetro email es requerido y debe ser una cadena de texto",
          "VALIDATION_ERROR",
          {
            received: email,
            expected: "string",
          }
        );
      }

      const forbiddenFields = ["_id", "createdAt", "password"];
      const invalidFields = Object.keys(updateData).filter((field) =>
        forbiddenFields.includes(field)
      );

      if (invalidFields.length > 0) {
        throw new ApiError(
          400,
          "No se pueden actualizar los siguientes campos",
          "INVALID_FIELDS",
          {
            forbiddenFields: invalidFields,
          }
        );
      }

      const user = await UserService.updateUserEmail(email, updateData);

      res.status(200).json(user);
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          errorType: error.errorType,
          message: error.message,
          details: error.details,
        });
        return;
      }

      res.status(500).json({
        errorType: "SERVER_ERROR",
        message: "Error al actualizar usuario",
        details: (error as Error).message,
      });
    }
  },

  changePassword: async (req: Request, res: Response) => {
    const parseResult = ChangePasswordSchema.safeParse({
      email: req.params.email,
      password: req.body.password,
    });

    if (!parseResult.success) {
      res.status(400).json({
        errorType: "VALIDATION_ERROR",
        message: "Datos de entrada inválidos",
        details: formatZodError(parseResult.error),
      });
      return;
    }

    const { email, password } = parseResult.data;

    try {
      const result = await UserService.changePassword(email, password);
      res.status(200).json(result);
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          errorType: error.errorType,
          message: error.message,
          details: error.details,
        });
        return;
      }

      res.status(500).json({
        errorType: "SERVER_ERROR",
        message: "Error interno al cambiar contraseña",
        details: (error as Error).message,
      });
    }
  },

  updateUserRole: async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const { role } = req.body;

      if (!email || typeof email !== "string") {
        throw new ApiError(400, "Email inválido", "VALIDATION_ERROR", {
          expected: "string",
          received: email,
        });
      }

      if (!role) {
        throw new ApiError(400, "El campo role es requerido", "MISSING_FIELD", {
          requiredFields: ["role"],
        });
      }

      const user = await UserService.updateUserRole(email, role);

      res.status(200).json({
        success: true,
        data: user,
        message: "Rol de usuario actualizado correctamente",
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          errorType: error.errorType,
          message: error.message,
          details: error.details,
        });
        return;
      }

      res.status(500).json({
        errorType: "SERVER_ERROR",
        message: "Error al actualizar el rol",
        details: (error as Error).message,
      });
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const requestingAdminEmail = req.user?.email;

      if (!email || typeof email !== "string") {
        throw new ApiError(400, "Email inválido", "VALIDATION_ERROR", {
          expected: "string",
          received: email,
        });
      }

      const result = await UserService.deleteUser(email, requestingAdminEmail);

      res.status(200).json({
        success: true,
        data: result,
        message: "Usuario eliminado correctamente",
      });
    } catch (error) {
      if (error instanceof ApiError) {
        res.status(error.statusCode).json({
          errorType: error.errorType,
          message: error.message,
          details: error.details,
        });
        return;
      }

      res.status(500).json({
        errorType: "SERVER_ERROR",
        message: "Error al eliminar usuario",
        details: (error as Error).message,
      });
    }
  },
};
