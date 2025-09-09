"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="7be4e7c2-09c7-5ef8-9a0b-1586def279b9")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_stock_item_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-stock-item-repository"));
const createGetStockItemByIdUseCase = (dependencies) => {
    return {
        execute: async (stockItemId, userId) => {
            if (!stockItemId || stockItemId.trim() === "") {
                throw new Error("Stock item ID or Stock ID cannot be empty.");
            }
            return dependencies.stockItemRepositoryDb.getStockItemById(stockItemId, userId);
        },
    };
};
const getStockItemByIdUseCase = createGetStockItemByIdUseCase({
    stockItemRepositoryDb: prisma_stock_item_repository_1.default,
});
exports.default = getStockItemByIdUseCase;
//# sourceMappingURL=get-stock-item-by-id.js.map
//# debugId=7be4e7c2-09c7-5ef8-9a0b-1586def279b9
