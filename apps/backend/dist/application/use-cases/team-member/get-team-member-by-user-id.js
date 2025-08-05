"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_team_member_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-team-member-repository"));
const createGetTeamMemberByUserIdUseCase = (dependencies) => {
    return {
        execute: async (data) => {
            const teamMember = await dependencies.teamMemberRepositoryDb.findUniqueMember(data.userId);
            return teamMember;
        },
    };
};
const getTeamMemberByUserIdUseCase = createGetTeamMemberByUserIdUseCase({
    teamMemberRepositoryDb: prisma_team_member_repository_1.default,
});
exports.default = getTeamMemberByUserIdUseCase;
