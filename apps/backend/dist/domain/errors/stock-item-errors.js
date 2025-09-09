"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="cf86aadc-3e1c-569b-859f-648785b79d93")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
function StockItemAlreadyExistsError() {
    const error = new Error(`Stock item already exists.`);
    error.name = "StockItemAlreadyExistsError";
    return error;
}
exports.default = StockItemAlreadyExistsError;
//# sourceMappingURL=stock-item-errors.js.map
//# debugId=cf86aadc-3e1c-569b-859f-648785b79d93
