import { ErrorRequestHandler } from "express";
import { ApiError } from "../utils/apiError";

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  if (err instanceof ApiError) {
    res.status(err.statusCode).json({
      errorType: err.errorType,
      message: err.message,
      details: err.details,
    });
    return;
  }

  console.error("Unhandled Error:", err);

  res.status(500).json({
    errorType: "SERVER_ERROR",
    message: "Ocurrió un error inesperado",
    details: err.message,
  });
};
