"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="458af4b3-212c-5846-adce-839e35c02dc8")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_team_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-team-repository"));
const createCreateTeamUseCase = (dependencies) => {
    return {
        execute: async (teamData) => {
            const newTeam = await dependencies.teamRepositoryDb.create({
                name: `${teamData.name}`,
            });
            return newTeam;
        },
    };
};
const createTeamUseCase = createCreateTeamUseCase({
    teamRepositoryDb: prisma_team_repository_1.default,
});
exports.default = createTeamUseCase;
//# sourceMappingURL=create-team.js.map
//# debugId=458af4b3-212c-5846-adce-839e35c02dc8
