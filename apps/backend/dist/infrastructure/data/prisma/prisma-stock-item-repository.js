"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const stockItem_mapper_1 = __importDefault(require("../../../infrastructure/mappers/stockItem-mapper"));
const prisma_1 = __importDefault(require("./prisma"));
const createStockItemRepositoryDb = (prismaStockRepository) => {
    return {
        addStockItem: async (data) => {
            const stockItem = await prismaStockRepository.stockItem.create({
                data: {
                    name: data.name,
                    unit: data.unit,
                    quantity: data.quantity,
                    threshold: data.threshold,
                    isActive: data.isActive ?? true,
                },
            });
            return (0, stockItem_mapper_1.default)(stockItem);
        },
        getStockItemById: async (id) => {
            const stockItem = await prismaStockRepository.stockItem.findUnique({
                where: { id },
            });
            return stockItem ? (0, stockItem_mapper_1.default)(stockItem) : null;
        },
        findStockItemByName: async (name) => {
            const stockItem = await prismaStockRepository.stockItem.findUnique({
                where: { name },
            });
            return stockItem ? (0, stockItem_mapper_1.default)(stockItem) : null;
        },
        getAllStockItems: async () => {
            const stockItems = await prismaStockRepository.stockItem.findMany();
            return stockItems.map(stockItem_mapper_1.default);
        },
    };
};
const stockItemRepositoryDb = createStockItemRepositoryDb(prisma_1.default);
exports.default = stockItemRepositoryDb;
