"use strict";
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
