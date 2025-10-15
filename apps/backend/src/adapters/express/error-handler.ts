import * as Sentry from "@sentry/node";
import { Request, Response, NextFunction } from "express";

import { Prisma } from "@prisma/client";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) {
  const userId = req.auth?.payload.sub ?? "anonymous";

  Sentry.withScope((scope) => {
    scope.setUser({ id: userId });
    scope.setContext("request", {
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.body,
    });
    Sentry.captureException(err);
  });

  let status: number;
  let message: string;

  if (
    err instanceof Prisma.PrismaClientKnownRequestError ||
    err instanceof Prisma.PrismaClientUnknownRequestError ||
    err instanceof Prisma.PrismaClientValidationError
  ) {
    status = 500;
    message = "Neznámý server error";
  } else {
    status =
      typeof err?.statusCode === "number"
        ? err.statusCode
        : err.name === "ValidationError"
        ? 400
        : err.name === "NotFoundError"
        ? 404
        : err.name === "ConflictError"
        ? 409
        : 500;

    message =
      process.env.NODE_ENV === "production" && status === 500
        ? "Neznámý server error"
        : err.message || "Neočekáváný error";
  }

  if (process.env.NODE_ENV !== "production") {
    console.error("[ErrorHandler]", err);
  }

  res.status(status).json({
    error: err.name ?? "Neznámý server error",
    message,
  });
}
