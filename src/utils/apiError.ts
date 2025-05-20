export class ApiError extends Error {
  statusCode: number;
  errorType: string;
  details?: unknown;

  constructor(
    statusCode: number,
    message: string,
    errorType = "GENERAL_ERROR",
    details?: unknown
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorType = errorType;
    this.details = details;

    // Mantiene el stack trace correcto
    Error.captureStackTrace(this, this.constructor);
  }
}
