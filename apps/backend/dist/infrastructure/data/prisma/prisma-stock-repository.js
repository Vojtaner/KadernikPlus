"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="9ceabaf9-5095-5e82-b905-e0cc2d93c2e5")}catch(e){}}();

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
//# sourceMappingURL=prisma-stock-repository.js.map
//# debugId=9ceabaf9-5095-5e82-b905-e0cc2d93c2e5
