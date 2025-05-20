import rateLimit from "express-rate-limit";

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // máximo 100 peticiones por IP
  message: {
    statusCode: 429,
    errorType: "TOO_MANY_REQUESTS",
    message: "Demasiadas solicitudes desde esta IP, intenta más tarde",
  },
});

export const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: {
    statusCode: 429,
    errorType: "TOO_MANY_LOGIN_ATTEMPTS",
    message: "Demasiados intentos de login, intenta más tarde",
  },
});
