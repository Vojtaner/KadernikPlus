import { Request, Response, NextFunction } from "express";

type ErrorRequestHandler = (
  err: { name: string; message: string; status: number },
  req: Request,
  res: Response,
  next: NextFunction
) => void;

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  if (err.name === "UnauthorizedError") {
    return res.status(401).json({
      error: "unauthorized",
      message: err.message || "Authorization failed",
    });
  }

  res.status(err.status || 500).json({
    error: "internal_server_error",
    message: err.message || "An unexpected error occurred",
  });
};

export default errorHandler;
