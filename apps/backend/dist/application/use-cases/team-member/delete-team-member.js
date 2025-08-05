"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_team_member_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-team-member-repository"));
const createDeleteTeamMemberUseCase = (dependencies) => {
    return {
        execute: async (id) => {
            const deletedMember = await dependencies.teamMemberRepositoryDb.delete(id);
            return deletedMember;
        },
    };
};
const deleteTeamMemberUseCase = createDeleteTeamMemberUseCase({
    teamMemberRepositoryDb: prisma_team_member_repository_1.default,
});
exports.default = deleteTeamMemberUseCase;
