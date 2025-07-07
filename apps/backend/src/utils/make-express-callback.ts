// src/frameworks/express/utils/make-express-callback.ts

import { Request, Response, NextFunction } from "express";

/**
 * Interface for a custom HTTP request object, extending Express's Request.
 * This can be used to add custom properties (like 'context' for authenticated user, etc.)
 * that might be set by middleware.
 */
export interface CustomRequest extends Request {
  // Add any custom properties here, e.g.:
  // userId?: string;
  // user?: { id: string; email: string; name?: string };
}

/**
 * Defines the structure for a "Controller" function within our clean architecture.
 * This function takes an HTTP request (parsed by makeExpressCallback) and returns a response.
 * It's designed to be asynchronous as it will often interact with use cases.
 */
export interface ControllerFunction {
  (httpRequest: {
    body: any;
    query: any;
    params: any;
    ip: string;
    method: string;
    path: string;
    headers: {
      [key: string]: string | string[] | undefined;
    };
    // Add any other properties you might need from the request (e.g., files, user context)
  }): Promise<{
    headers?: { [key: string]: string };
    statusCode: number;
    body: any;
  }>;
}

/**
 * A higher-order function that wraps an Express route handler to enforce
 * a consistent structure for requests and responses, and handle errors.
 * This is a core pattern in clean architecture to separate concerns.
 *
 * @param controller A function that encapsulates the business logic for an endpoint.
 * It receives a structured httpRequest object and returns a Promise
 * resolving to an object with statusCode, headers, and body.
 * @returns An Express RequestHandler function (req, res, next).
 */
export const makeExpressCallback = (controller: ControllerFunction) => {
  return async (req: CustomRequest, res: Response, next: NextFunction) => {
    try {
      // 1. Construct a standardized httpRequest object from the Express request.
      // This decouples the controller from Express's specific request object.
      const httpRequest = {
        body: req.body,
        query: req.query,
        params: req.params,
        ip: req.ip || "ipError",
        method: req.method,
        path: req.path,
        headers: req.headers,
      };

      // 2. Call the provided controller function with the standardized request.
      // The controller contains the actual business logic (calling use cases, etc.).
      const httpResponse = await controller(httpRequest);

      // 3. Send the HTTP response based on the controller's output.
      // If headers are provided, set them.
      if (httpResponse.headers) {
        res.set(httpResponse.headers);
      }
      // Send the status code and the body.
      res.status(httpResponse.statusCode).send(httpResponse.body);
    } catch (e: any) {
      // 4. Global error handling for any unhandled exceptions in the controller.
      // This prevents Express from hanging and provides a consistent error response.
      console.error("Error in makeExpressCallback:", e);

      // You can customize error responses based on error types
      // For now, a generic 500 Internal Server Error.
      res
        .status(500)
        .send({ error: e.message || "An unknown error occurred." });
      // If you want to pass error to Express error middleware (e.g., for logging), use next(e);
      // next(e);
    }
  };
};
