"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_stock_item_repository_1 = __importDefault(require("../../infrastructure/data/prisma/prisma-stock-item-repository"));
const createGetAllStockItemsUseCaseType = (dependencies) => {
    return {
        execute: async () => {
            return dependencies.stockItemRepositoryDb.getAllStockItems();
        },
    };
};
const getAllStockItemsUseCase = createGetAllStockItemsUseCaseType({
    stockItemRepositoryDb: prisma_stock_item_repository_1.default,
});
exports.default = getAllStockItemsUseCase;
