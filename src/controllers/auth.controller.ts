import { Request, Response } from "express";
import { AuthService } from "../services/auth.service";
import { z } from "zod";
import { formatZodError } from "../utils/error.utils";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const AuthController = {
  register: async (req: Request, res: Response) => {
    try {
      const { email, password } = registerSchema.parse(req.body);
      const user = await AuthService.register(email, password);
      res.status(201).json(user);
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

  login: async (req: Request, res: Response) => {
    try {
      const { email, password } = registerSchema.parse(req.body);
      const result = await AuthService.login(email, password);
      res.cookie("token", result.token, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 3600000,
      });
      res.status(200).json({ user: result.user });
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
};
