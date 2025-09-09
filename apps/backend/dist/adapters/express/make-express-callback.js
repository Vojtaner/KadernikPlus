"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="ff652841-0d76-5a05-8165-f0ad1fc79189")}catch(e){}}();

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
            res.status(e.status).send({
                message: e.message || "Neznámý error,chyba serveru.",
                status: e.status || 500,
            });
        }
    };
};
exports.makeExpressCallback = makeExpressCallback;
//# sourceMappingURL=make-express-callback.js.map
//# debugId=ff652841-0d76-5a05-8165-f0ad1fc79189
