import { RequestHandler } from "express";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model";

export const authenticateJWT: RequestHandler = async (req, res, next) => {
  const token = req.cookies.token || req.headers.authorization?.split(" ")[1];

  if (!token) {
    res
      .status(401)
      .json({ error: "Acceso no autorizado: Token no proporcionado" });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: string;
    };
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      res.status(401).json({ error: "Usuario no existe o token invalido" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: "Token inválido o expirado" });
    return;
  }
};
