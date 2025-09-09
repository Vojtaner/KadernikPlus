"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c0cfb234-b281-5507-b8a3-f4512e88eb73")}catch(e){}}();

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
//# sourceMappingURL=get-stocks-by-user-id.js.map
//# debugId=c0cfb234-b281-5507-b8a3-f4512e88eb73
