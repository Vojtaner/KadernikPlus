"use strict";
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
