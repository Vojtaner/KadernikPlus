"use strict";
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
