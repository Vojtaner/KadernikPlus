"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_stock_item_repository_1 = __importDefault(require("../../infrastructure/data/prisma/prisma-stock-item-repository"));
const createAddStockItemUseCase = (dependencies) => {
    return {
        execute: async (data) => {
            if (!data.name || data.name.trim() === "") {
                throw new Error("Stock item name cannot be empty.");
            }
            if (!data.unit || data.unit.trim() === "") {
                throw new Error("Stock item unit cannot be empty.");
            }
            if (data.quantity < 0) {
                throw new Error("Stock item quantity cannot be negative.");
            }
            if (data.threshold < 0) {
                throw new Error("Stock item threshold cannot be negative.");
            }
            if (typeof data.isActive !== "boolean" && data.isActive !== undefined) {
                throw new Error("Stock item isActive must be a boolean.");
            }
            const newStockItem = await dependencies.stockItemRepositoryDb.addStockItem(data);
            return newStockItem;
        },
    };
};
const addStockItemUseCase = createAddStockItemUseCase({
    stockItemRepositoryDb: prisma_stock_item_repository_1.default,
});
exports.default = addStockItemUseCase;
