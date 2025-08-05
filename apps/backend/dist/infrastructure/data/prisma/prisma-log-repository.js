"use strict";
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
