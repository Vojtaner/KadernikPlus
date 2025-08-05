"use strict";
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
