"use strict";
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
