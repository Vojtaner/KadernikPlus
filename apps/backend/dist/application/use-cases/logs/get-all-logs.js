"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="310211cc-9234-5d1b-9b91-03e8949fe163")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_log_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-log-repository"));
const createGetAllLogsUseCase = (dependencies) => {
    return {
        execute: async (userId) => {
            const logs = await dependencies.logRepositoryDb.getAllLogs(userId);
            // Map entityId: null to entityId: undefined to match LogData type
            return logs;
        },
    };
};
const getAllLogsUseCase = createGetAllLogsUseCase({
    logRepositoryDb: prisma_log_repository_1.default,
});
exports.default = getAllLogsUseCase;
//# sourceMappingURL=get-all-logs.js.map
//# debugId=310211cc-9234-5d1b-9b91-03e8949fe163
