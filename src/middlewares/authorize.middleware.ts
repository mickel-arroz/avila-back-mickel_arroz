import { RequestHandler } from "express";

export const authorizeRoles = (...allowedRoles: string[]): RequestHandler => {
  return async (req, res, next) => {
    if (!req.user) {
      res.status(401).json({ error: "Usuario no autenticado" });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        error: `Acceso prohibido. Roles permitidos: ${allowedRoles.join(", ")}`,
        yourRole: req.user.role,
      });
      return;
    }

    next();
  };
};
