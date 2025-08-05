"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_team_member_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-team-member-repository"));
const createGetTeamMemberUseCase = (dependencies) => {
    return {
        execute: async (data) => {
            const teamMembers = await dependencies.teamMemberRepositoryDb.findMany(data.teamId, data.userId);
            return teamMembers;
        },
    };
};
const getTeamMemberUseCase = createGetTeamMemberUseCase({
    teamMemberRepositoryDb: prisma_team_member_repository_1.default,
});
exports.default = getTeamMemberUseCase;
