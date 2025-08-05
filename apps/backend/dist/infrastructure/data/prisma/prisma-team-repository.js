"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./prisma"));
const createTeamRepositoryDb = (prisma) => ({
    create: async (teamData) => {
        const newTeam = await prisma.team.create({
            data: {
                name: teamData.name,
            },
        });
        return newTeam;
    },
    findById: async (teamId) => {
        const team = await prisma.team.findUnique({
            where: {
                id: teamId,
            },
        });
        return team;
    },
});
const teamRepositoryDb = createTeamRepositoryDb(prisma_1.default);
exports.default = teamRepositoryDb;
