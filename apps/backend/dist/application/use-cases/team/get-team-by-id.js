"use strict";
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
