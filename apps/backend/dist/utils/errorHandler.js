"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="b9a7c33b-b038-59d4-b628-6c405194d6dc")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
const errorHandler = (err, req, res, next) => {
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
exports.default = errorHandler;
//# sourceMappingURL=errorHandler.js.map
//# debugId=b9a7c33b-b038-59d4-b628-6c405194d6dc
