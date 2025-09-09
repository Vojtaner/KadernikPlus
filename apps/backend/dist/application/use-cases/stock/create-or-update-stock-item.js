"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="e84d701d-e16a-597e-8564-52ac81057a3f")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_stock_item_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-stock-item-repository"));
const stock_item_controller_1 = require("../../../infrastructure/controllers/stock-item-controller");
const httpError_1 = require("../../../adapters/express/httpError");
const createOrUpdateCreateStockItemUseCase = (dependencies) => {
    return {
        execute: async (data) => {
            if ((0, stock_item_controller_1.isNewStockItem)(data)) {
                if (!data.itemName || data.itemName.trim() === "") {
                    throw (0, httpError_1.httpError)("Název skladové položky nesmí být prázdný.", 422);
                }
                if (!data.unit || data.unit.trim() === "") {
                    throw (0, httpError_1.httpError)("Jednotka skladové položky nesmí být prázdná.", 422);
                }
                if (data.quantity < 0) {
                    throw (0, httpError_1.httpError)("Množství skladové položky nesmí být záporné.", 400);
                }
                if (data.threshold < 0) {
                    throw (0, httpError_1.httpError)("Práh skladové položky nesmí být záporný.", 400);
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
//# sourceMappingURL=create-or-update-stock-item.js.map
//# debugId=e84d701d-e16a-597e-8564-52ac81057a3f
