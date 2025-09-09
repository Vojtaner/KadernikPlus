"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="ef897f51-1d19-511c-81d5-15fe77a62511")}catch(e){}}();

Object.defineProperty(exports, "__esModule", { value: true });
const mapToDomainStock = (prismaStockItem) => {
    return {
        id: prismaStockItem.id,
        stockName: prismaStockItem.stockName,
        ownerId: prismaStockItem.ownerId,
        createdAt: prismaStockItem.createdAt,
    };
};
exports.default = mapToDomainStock;
//# sourceMappingURL=stock-mapper.js.map
//# debugId=ef897f51-1d19-511c-81d5-15fe77a62511
