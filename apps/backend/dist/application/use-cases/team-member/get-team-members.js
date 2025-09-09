"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="26c110b4-06ea-56b0-a1a9-50697f5853df")}catch(e){}}();

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
//# sourceMappingURL=get-team-members.js.map
//# debugId=26c110b4-06ea-56b0-a1a9-50697f5853df
