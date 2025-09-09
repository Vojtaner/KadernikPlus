"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="1582964a-371e-55b6-9923-6e6fa901fa57")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./prisma"));
const createStockAllowanceRepositoryDb = (prisma) => {
    return {
        getAllByDatesAndTeamId: async (teamId, fromDate, toDate) => {
            const stockAllowances = await prisma.stockAllowance.findMany({
                where: {
                    teamId,
                    createdAt: { gte: fromDate, lte: toDate },
                },
                include: {
                    procedure: {
                        select: { visitId: true, visit: { select: { clientId: true } } },
                    },
                    stockItem: {
                        select: { itemName: true, avgUnitPrice: true, unit: true },
                    },
                    user: { select: { name: true } },
                },
            });
            console.log({ stockAllowances });
            return stockAllowances;
        },
    };
};
const stockAllowanceRepositoryDb = createStockAllowanceRepositoryDb(prisma_1.default);
exports.default = stockAllowanceRepositoryDb;
//# sourceMappingURL=prisma-stock-allowance-repository.js.map
//# debugId=1582964a-371e-55b6-9923-6e6fa901fa57
