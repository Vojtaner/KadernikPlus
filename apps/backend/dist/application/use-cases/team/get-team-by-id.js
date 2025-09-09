"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c8d3c24d-052d-5f34-b29b-b98a18eaa76c")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_team_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-team-repository"));
const createGetTeamByIdUseCase = (dependencies) => {
    return {
        execute: async (data) => {
            const team = await dependencies.teamRepositoryDb.findById(data.teamId);
            return team;
        },
    };
};
const getTeamByIdUseCase = createGetTeamByIdUseCase({
    teamRepositoryDb: prisma_team_repository_1.default,
});
exports.default = getTeamByIdUseCase;
//# sourceMappingURL=get-team-by-id.js.map
//# debugId=c8d3c24d-052d-5f34-b29b-b98a18eaa76c
