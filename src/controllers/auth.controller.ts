import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { z } from "zod";
import { formatZodError } from "../utils/error.utils";
import { ApiError } from "../utils/apiError";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const AuthController = {
  register: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = registerSchema.parse(req.body);
      const user = await AuthService.register(email, password);
      res.status(201).json(user);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(
          new ApiError(
            400,
            "Datos inválidos para registro",
            "VALIDATION_ERROR",
            formatZodError(error)
          )
        );
      }

      return next(error);
    }
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = registerSchema.parse(req.body);
      const result = await AuthService.login(email, password);

      res.cookie("token", result.token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 3600000,
      });

      res.status(200).json({ user: result.user, token: result.token });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return next(
          new ApiError(
            400,
            "Datos inválidos para inicio de sesión",
            "VALIDATION_ERROR",
            formatZodError(error)
          )
        );
      }

      return next(error);
    }
  },
};
