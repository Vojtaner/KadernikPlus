"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="3ea14c30-3a62-5d92-b959-0b7fe8a9daac")}catch(e){}}();

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
//# sourceMappingURL=prisma-team-repository.js.map
//# debugId=3ea14c30-3a62-5d92-b959-0b7fe8a9daac
