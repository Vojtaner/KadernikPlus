"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_stock_item_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-stock-item-repository"));
const stock_item_controller_1 = require("../../../infrastructure/controllers/stock-item-controller");
const createOrUpdateCreateStockItemUseCase = (dependencies) => {
    return {
        execute: async (data) => {
            if ((0, stock_item_controller_1.isNewStockItem)(data)) {
                if (!data.itemName || data.itemName.trim() === "") {
                    throw new Error("Název skladové položky nesmí být prázdný.");
                }
                if (!data.unit || data.unit.trim() === "") {
                    throw new Error("Jednotka skladové položky nesmí být prázdná.");
                }
                if (data.quantity < 0) {
                    throw new Error("Množství skladové položky nesmí být záporné.");
                }
                if (data.threshold < 0) {
                    throw new Error("Práh skladové položky nesmí být záporný.");
                }
            }
            const newOrUpdatedStockItem = await dependencies.stockItemRepositoryDb.createOrUpdateStockItem(data);
            return newOrUpdatedStockItem;
        },
    };
};
const createOrUpdateStockItemUseCase = createOrUpdateCreateStockItemUseCase({
    stockItemRepositoryDb: prisma_stock_item_repository_1.default,
});
exports.default = createOrUpdateStockItemUseCase;
