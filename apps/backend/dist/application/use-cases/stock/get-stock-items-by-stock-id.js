"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="40996ab1-fce7-5643-b276-e450976bcc4f")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_stock_item_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-stock-item-repository"));
const createGetStockItemsByStockIdUseCase = (dependencies) => {
    return {
        execute: async (stockId, userId) => {
            if (!stockId || stockId.trim() === "") {
                throw new Error("Stock item ID or Stock ID cannot be empty.");
            }
            return dependencies.stockItemRepositoryDb.getStockItemsByStockId(stockId, userId);
        },
    };
};
const getStockItemsByStockIdUseCase = createGetStockItemsByStockIdUseCase({
    stockItemRepositoryDb: prisma_stock_item_repository_1.default,
});
exports.default = getStockItemsByStockIdUseCase;
//# sourceMappingURL=get-stock-items-by-stock-id.js.map
//# debugId=40996ab1-fce7-5643-b276-e450976bcc4f
