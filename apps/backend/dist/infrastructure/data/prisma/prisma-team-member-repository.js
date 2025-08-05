"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./prisma"));
const team_member_1 = require("../../../entities/team-member");
const createTeamMemberRepositoryDb = (prisma) => ({
    create: async (memberData) => {
        const newMember = await prisma.teamMember.create({
            data: {
                userId: memberData.userId,
                teamId: memberData.teamId,
                canAccessStocks: memberData.canAccessStocks,
                canAccessClients: memberData.canAccessClients,
                canAccessVisits: memberData.canAccessVisits,
            },
        });
        return newMember;
    },
    delete: async (teamMemberRowId) => {
        await prisma.teamMember.delete({
            where: {
                id: teamMemberRowId,
            },
        });
    },
    findMany: async (teamId, userId) => {
        if (team_member_1.DEFAULT_USERS_TEAM === teamId) {
            const members = await prisma.teamMember.findMany({
                where: {
                    teamId,
                    NOT: {
                        userId: userId,
                    },
                },
                include: {
                    user: {
                        select: {
                            name: true,
                        },
                    },
                },
            });
            return members;
        }
        const members = await prisma.teamMember.findMany({
            where: {
                teamId,
                NOT: {
                    userId: userId,
                },
            },
            include: {
                user: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        return members;
    },
    findUniqueMember: async (userId) => {
        const teamMember = await prisma.teamMember.findFirst({
            where: {
                userId,
            },
        });
        return teamMember;
    },
    update: async (data) => {
        const teamMember = await prisma.teamMember.upsert({
            where: {
                teamId_userId: {
                    teamId: data.teamId,
                    userId: data.userId,
                },
            },
            update: {
                canAccessClients: data.canAccessClients,
                canAccessStocks: data.canAccessStocks,
                canAccessVisits: data.canAccessVisits,
            },
            create: {
                teamId: data.teamId,
                userId: data.userId,
                canAccessClients: data.canAccessClients,
                canAccessStocks: data.canAccessStocks,
                canAccessVisits: data.canAccessVisits,
            },
        });
        return teamMember;
    },
});
const teamMemberRepositoryDb = createTeamMemberRepositoryDb(prisma_1.default);
exports.default = teamMemberRepositoryDb;
