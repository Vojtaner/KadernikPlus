"use strict";
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
