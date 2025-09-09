"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="f0f8f6e0-40e6-5059-bbc1-1c54298a7a01")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_team_member_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-team-member-repository"));
const createUpdateTeamMemberSkillUseCase = (dependencies) => {
    return {
        execute: async (data) => {
            const updatedMember = await dependencies.teamMemberRepositoryDb.update(data);
            return updatedMember;
        },
    };
};
const updateTeamMemberSkillUseCase = createUpdateTeamMemberSkillUseCase({
    teamMemberRepositoryDb: prisma_team_member_repository_1.default,
});
exports.default = updateTeamMemberSkillUseCase;
//# sourceMappingURL=update-team-member-skill.js.map
//# debugId=f0f8f6e0-40e6-5059-bbc1-1c54298a7a01
