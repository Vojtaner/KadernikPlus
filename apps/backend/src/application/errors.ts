export type AppError = {
  name: string;
  message: string;
  statusCode: number;
  stack?: string;
};

function createError(
  name: string,
  message: string,
  statusCode: number
): AppError {
  const error = new Error(message) as AppError;
  error.name = name;
  error.statusCode = statusCode;
  return error;
}

// ==============================
// SPECIFICKÉ CHYBY
// ==============================

export const NotFoundError = (message = "Resource not found") =>
  createError("NotFoundError", message, 404);

export const ValidationError = (message = "Invalid input") =>
  createError("ValidationError", message, 400);

export const UnauthorizedError = (message = "Unauthorized") =>
  createError("UnauthorizedError", message, 401);

export const ForbiddenError = (message = "Forbidden") =>
  createError("ForbiddenError", message, 403);

export const ConflictError = (message = "Conflict") =>
  createError("ConflictError", message, 409);

export const InternalServerError = (message = "Internal Server Error") =>
  createError("InternalServerError", message, 500);

export const BadRequestError = (message = "Bad Request") =>
  createError("BadRequestError", message, 400);

export const TimeoutError = (message = "Request Timeout") =>
  createError("TimeoutError", message, 504);

export const ServiceUnavailableError = (message = "Service Unavailable") =>
  createError("ServiceUnavailableError", message, 503);

// Vlastní:
export const StockItemAlreadyExistsError = (
  message = "Stock item already exists"
) => createError("StockItemAlreadyExistsError", message, 409);
