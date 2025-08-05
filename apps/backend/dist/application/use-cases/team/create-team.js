"use strict";
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
