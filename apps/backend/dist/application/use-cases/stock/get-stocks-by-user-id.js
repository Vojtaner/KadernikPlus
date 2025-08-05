"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_stock_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-stock-repository"));
const createGetStocksByUserIdUseCase = (dependencies) => {
    return {
        execute: async (userId) => {
            return dependencies.stockRepositoryDb.getStocks(userId);
        },
    };
};
const getStocksByUserIdUseCase = createGetStocksByUserIdUseCase({
    stockRepositoryDb: prisma_stock_repository_1.default,
});
exports.default = getStocksByUserIdUseCase;
