"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="360696aa-6eae-5ba7-945d-ee733528f336")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_stock_item_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-stock-item-repository"));
const createDeleteStockItemByIdUseCase = (dependencies) => {
    return {
        execute: async (stockItemId, userId) => {
            if (!stockItemId || stockItemId.trim() === "") {
                throw new Error("Chybí ID položky.");
            }
            return dependencies.stockItemRepositoryDb.deleteStockItem(stockItemId, userId);
        },
    };
};
const deleteStockItemByIdUseCase = createDeleteStockItemByIdUseCase({
    stockItemRepositoryDb: prisma_stock_item_repository_1.default,
});
exports.default = deleteStockItemByIdUseCase;
//# sourceMappingURL=delete-stock-item-by-id.js.map
//# debugId=360696aa-6eae-5ba7-945d-ee733528f336
