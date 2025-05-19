import { Request, Response } from "express";
import { z } from "zod";
import { formatZodError } from "../utils/error.utils";
import { UserService } from "../services/user.service";

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
          error: "Validation failed",
          details: formatZodError(error),
        });
      } else if (error instanceof Error) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: "Unknown error" });
      }
    }
  },

  updateUserEmail: async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const updateData = req.body;

      if (!email || typeof email !== "string") {
        res.status(400).json({
          errorType: "VALIDATION_ERROR",
          message:
            "El parámetro email es requerido y debe ser una cadena de texto",
          details: {
            received: email,
            expected: "string",
          },
        });
        return;
      }

      const forbiddenFields = ["_id", "createdAt", "password"];
      const invalidFields = Object.keys(updateData).filter((field) =>
        forbiddenFields.includes(field)
      );

      if (invalidFields.length > 0) {
        res.status(400).json({
          errorType: "INVALID_FIELDS",
          message: "No se pueden actualizar los siguientes campos",
          details: {
            forbiddenFields: invalidFields,
          },
        });
        return;
      }

      const user = await UserService.updateUserEmail(email, updateData);

      res.status(200).json(user);
    } catch (error: any) {
      let statusCode = 400;
      let errorResponse = {
        errorType: "UNKNOWN_ERROR",
        message: error.message,
        details: {},
      };

      if (error.message.includes("Usuario no encontrado")) {
        statusCode = 404;
        errorResponse.errorType = "USER_NOT_FOUND";
        errorResponse.details = { email: req.params.email };
      } else if (error.message.includes("duplicate key error")) {
        errorResponse.errorType = "DUPLICATE_ENTRY";
        errorResponse.message = "El email ya está en uso por otro usuario";
      } else if (error.name === "ValidationError") {
        errorResponse.errorType = "VALIDATION_ERROR";
        errorResponse.details = error.errors;
      }

      res.status(statusCode).json(errorResponse);
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
      return;
    } catch (error: any) {
      let payload: any;
      try {
        payload = JSON.parse(error.message);
      } catch {
        res.status(500).json({
          errorType: "SERVER_ERROR",
          message: "Error interno al cambiar contraseña",
          details: error.message,
        });
        return;
      }
      const statusCode =
        payload.errorType === "USER_NOT_FOUND"
          ? 404
          : payload.errorType === "PASSWORD_SAME_AS_OLD"
          ? 400
          : 500;
      res.status(statusCode).json(payload);
      return;
    }
  },

  updateUserRole: async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const { role } = req.body;

      if (!email || typeof email !== "string") {
        res.status(400).json({
          errorType: "VALIDATION_ERROR",
          message: "Email inválido",
          details: {
            expected: "string",
            received: email,
          },
        });
        return;
      }

      if (!role) {
        res.status(400).json({
          errorType: "MISSING_FIELD",
          message: "El campo role es requerido",
          details: {
            requiredFields: ["role"],
          },
        });
        return;
      }
      const user = await UserService.updateUserRole(email, role);

      res.status(200).json({
        success: true,
        data: user,
        message: "Rol de usuario actualizado correctamente",
      });
      return;
    } catch (error: any) {
      let statusCode = 400;
      let errorResponse;

      try {
        errorResponse = JSON.parse(error.message);
        statusCode = errorResponse.errorType === "USER_NOT_FOUND" ? 404 : 400;
      } catch (e) {
        errorResponse = {
          errorType: "SERVER_ERROR",
          message: "Error al actualizar el rol",
          details: error.message,
        };
        statusCode = 500;
      }

      res.status(statusCode).json(errorResponse);
      return;
    }
  },

  deleteUser: async (req: Request, res: Response) => {
    try {
      const { email } = req.params;
      const requestingAdminEmail = req.user?.email;

      if (!email || typeof email !== "string") {
        res.status(400).json({
          errorType: "VALIDATION_ERROR",
          message: "Email inválido",
          details: {
            expected: "string",
            received: email,
          },
        });
        return;
      }

      const result = await UserService.deleteUser(email, requestingAdminEmail);

      res.status(200).json({
        success: true,
        data: result,
        message: "Usuario eliminado correctamente",
      });
      return;
    } catch (error: any) {
      let statusCode = 400;
      let errorResponse;

      try {
        errorResponse = JSON.parse(error.message);
        statusCode =
          errorResponse.errorType === "USER_NOT_FOUND"
            ? 404
            : errorResponse.errorType === "SELF_DELETION"
            ? 403
            : 400;
      } catch (e) {
        errorResponse = {
          errorType: "SERVER_ERROR",
          message: "Error al eliminar usuario",
          details: error.message,
        };
        statusCode = 500;
      }

      res.status(statusCode).json(errorResponse);
      return;
    }
  },
};
