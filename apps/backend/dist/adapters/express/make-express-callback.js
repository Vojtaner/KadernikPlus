"use strict";
// src/frameworks/express/utils/make-express-callback.ts
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeExpressCallback = void 0;
const makeExpressCallback = (controller) => {
    return async (req, res, next) => {
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
            };
            const httpResponse = await controller(httpRequest);
            if (httpResponse.headers) {
                res.set(httpResponse.headers);
            }
            res.status(httpResponse.statusCode).send(httpResponse.body);
        }
        catch (e) {
            console.error("Error in makeExpressCallback:", e);
            res.status(500).send({
                message: e.message || "Neznámý error,chyba serveru.",
                status: e.status || 500,
            });
        }
    };
};
exports.makeExpressCallback = makeExpressCallback;
