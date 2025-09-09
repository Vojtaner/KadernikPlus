"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="2373b7cc-0db0-5687-8847-a1293d4a7d60")}catch(e){}}();

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
//# sourceMappingURL=get-team-member-by-user-id.js.map
//# debugId=2373b7cc-0db0-5687-8847-a1293d4a7d60
