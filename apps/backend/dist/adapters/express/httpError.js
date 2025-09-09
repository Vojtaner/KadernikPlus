"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="91e3b4eb-7e82-5054-a4d0-707e8d35cf8b")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
exports.httpError = httpError;
function httpError(message, status = 500, code, details) {
    const error = new Error(message);
    error.status = status;
    if (code)
        error.code = code;
    if (details)
        error.details = details;
    return error;
}
//# sourceMappingURL=httpError.js.map
//# debugId=91e3b4eb-7e82-5054-a4d0-707e8d35cf8b
