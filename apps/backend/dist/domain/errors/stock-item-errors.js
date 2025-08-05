"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function StockItemAlreadyExistsError() {
    const error = new Error(`Stock item already exists.`);
    error.name = "StockItemAlreadyExistsError";
    return error;
}
exports.default = StockItemAlreadyExistsError;
