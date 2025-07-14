"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mapToDomainStockItem = (prismaStockItem) => {
    return {
        id: prismaStockItem.id,
        name: prismaStockItem.name,
        unit: prismaStockItem.unit,
        quantity: prismaStockItem.quantity,
        threshold: prismaStockItem.threshold,
        isActive: prismaStockItem.isActive,
        createdAt: prismaStockItem.createdAt,
        updatedAt: prismaStockItem.updatedAt,
    };
};
exports.default = mapToDomainStockItem;
