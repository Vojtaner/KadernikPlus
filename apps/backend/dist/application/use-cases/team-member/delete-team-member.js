"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="c7bf2c0f-462c-589f-b487-cd7647b41757")}catch(e){}}();

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
//# sourceMappingURL=delete-team-member.js.map
//# debugId=c7bf2c0f-462c-589f-b487-cd7647b41757
