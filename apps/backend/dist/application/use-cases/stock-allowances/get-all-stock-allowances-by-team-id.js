"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="85832eea-4a20-5d7e-99f0-83b103f60816")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_stock_allowance_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-stock-allowance-repository"));
const createGetAllStockAllowancesByTeamIdUseCase = (dependencies) => {
    return {
        execute: async (teamId, fromDate, toDate) => {
            const stockAllowaces = await dependencies.stockAllowanceRepositoryDb.getAllByDatesAndTeamId(teamId, fromDate, toDate);
            return stockAllowaces;
        },
    };
};
const getAllStockAllowancesByTeamIdUseCase = createGetAllStockAllowancesByTeamIdUseCase({ stockAllowanceRepositoryDb: prisma_stock_allowance_repository_1.default });
exports.default = getAllStockAllowancesByTeamIdUseCase;
//# sourceMappingURL=get-all-stock-allowances-by-team-id.js.map
//# debugId=85832eea-4a20-5d7e-99f0-83b103f60816
