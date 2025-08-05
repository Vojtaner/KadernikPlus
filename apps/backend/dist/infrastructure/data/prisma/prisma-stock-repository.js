"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./prisma"));
const createStockRepositoryDb = (prismaStockRepository) => {
    return {
        createStock: async (userId, teamId) => {
            const count = await prismaStockRepository.stock.count({
                where: { ownerId: userId },
            });
            const stock = await prismaStockRepository.stock.create({
                data: {
                    ownerId: userId,
                    stockName: `Sklad ${count + 1}`,
                    teamId,
                },
            });
            return stock;
        },
        updateStock: async (teamId, invitedUserId) => {
            const stockToUpdate = await prisma_1.default.stock.findFirst({
                where: { ownerId: invitedUserId },
            });
            if (stockToUpdate) {
                const updatedStock = await prisma_1.default.stock.update({
                    where: { id: stockToUpdate.id },
                    data: { teamId },
                });
                return updatedStock;
            }
            else {
                throw new Error("Sklad zvaného uživatele nenalezen. Nemožné přidat.");
            }
        },
        getStocks: async (userId) => {
            const stocks = await prismaStockRepository.stock.findMany({
                where: {
                    ownerId: userId,
                },
            });
            return stocks;
        },
    };
};
const stockRepositoryDb = createStockRepositoryDb(prisma_1.default);
exports.default = stockRepositoryDb;
