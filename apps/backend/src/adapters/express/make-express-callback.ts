// src/frameworks/express/utils/make-express-callback.ts

import { Request, Response, NextFunction } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import QueryString from "qs";

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

export type ControllerFunction<T = { body?: any; params?: any; query?: any }> =
  {
    (httpRequest: {
      body: T extends { body: infer B } ? B : any;
      params: T extends { params: infer P } ? P : any;
      query: T extends { query: infer Q } ? Q : any;
      ip: string;
      method: string;
      path: string;
      userId: string;
      headers: {
        [key: string]: string | string[] | undefined;
      };
    }): Promise<{
      headers?: { [key: string]: string };
      statusCode: number;
      body: any;
    }>;
  };

export const makeExpressCallback = <T>(controller: ControllerFunction<T>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const httpRequest = {
        body: req.body,
        query: req.query,
        params: req.params,
        ip: req.ip || "ipError",
        method: req.method,
        path: req.path,
        userId: req.auth?.payload.sub,
        headers: req.headers,
      } as any;

      const httpResponse = await controller(httpRequest);

      if (httpResponse.headers) {
        res.set(httpResponse.headers);
      }
      res.status(httpResponse.statusCode).send(httpResponse.body);
    } catch (e: any) {
      console.error("Error in makeExpressCallback:", e);
      res.status(500).send({
        error: e.message || "An unknown error occurred.",
        status: e.status || 500,
      });
    }
  };
};
