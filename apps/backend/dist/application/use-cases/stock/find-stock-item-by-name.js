"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="57113248-8c82-5dc8-89ae-442598b12cf0")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_stock_item_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-stock-item-repository"));
const createFindStockItemByNameUseCase = (dependencies) => {
    return {
        execute: async (name) => {
            if (!name || name.trim() === "") {
                throw new Error("Stock item name cannot be empty for lookup.");
            }
            return dependencies.stockItemRepositoryDb.findStockItemByName(name);
        },
    };
};
const findStockItemByNameUseCase = createFindStockItemByNameUseCase({
    stockItemRepositoryDb: prisma_stock_item_repository_1.default,
});
exports.default = findStockItemByNameUseCase;
//# sourceMappingURL=find-stock-item-by-name.js.map
//# debugId=57113248-8c82-5dc8-89ae-442598b12cf0
