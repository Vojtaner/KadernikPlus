"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="d0ba9e29-7bb1-512a-93e9-e52b60c595aa")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./prisma"));
const createLogRepository = (prisma) => {
    return {
        log: async (logData) => {
            await prisma.logEntry.create({ data: logData });
        },
        getAllLogs: async (userId) => {
            const teamMember = await prisma.teamMember.findUnique({
                where: { userId },
            });
            const logs = await prisma.logEntry.findMany({
                where: { OR: [{ teamId: teamMember?.teamId, userId }] },
                include: { user: true },
                orderBy: { createdAt: "desc" },
            });
            return logs;
        },
    };
};
const logRepositoryDb = createLogRepository(prisma_1.default);
exports.default = logRepositoryDb;
//# sourceMappingURL=prisma-log-repository.js.map
//# debugId=d0ba9e29-7bb1-512a-93e9-e52b60c595aa
