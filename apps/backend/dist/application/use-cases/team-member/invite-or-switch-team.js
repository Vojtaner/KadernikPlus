"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="a656266c-5f4d-57a0-8ab9-20bc377cb7cc")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_team_member_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-team-member-repository"));
const prisma_user_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-user-repository"));
const prisma_stock_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-stock-repository"));
const createInviteOrSwitchTeamUseCase = (dependencies) => {
    return {
        execute: async (data) => {
            const { invitedEmail, invitedUserIdLast4, newTeamId } = data;
            //najít invited user za email
            //najit jeho teamId
            //najít najit dle toho teamId
            const invitedUser = await dependencies.userRepositoryDb.findByEmail(invitedEmail);
            if (!invitedUser) {
                throw new Error("User not found with this email.");
            }
            const last4 = invitedUser.id.slice(-4);
            if (last4 !== invitedUserIdLast4) {
                throw new Error("User ID mismatch.");
            }
            const currentMembership = await dependencies.teamMemberRepositoryDb.findUniqueMember(invitedUser.id);
            if (currentMembership && currentMembership.teamId !== newTeamId) {
                await dependencies.teamMemberRepositoryDb.delete(currentMembership.id);
            }
            const stock = await dependencies.stockRepositoryDb.updateStock(newTeamId, invitedUser.id);
            const newMember = await dependencies.teamMemberRepositoryDb.create({
                userId: invitedUser.id,
                teamId: newTeamId,
                canAccessStocks: false,
                canAccessClients: false,
                canAccessVisits: false,
            });
            return newMember;
        },
    };
};
const inviteOrSwitchTeamUseCase = createInviteOrSwitchTeamUseCase({
    userRepositoryDb: prisma_user_repository_1.default,
    teamMemberRepositoryDb: prisma_team_member_repository_1.default,
    stockRepositoryDb: prisma_stock_repository_1.default,
});
exports.default = inviteOrSwitchTeamUseCase;
//# sourceMappingURL=invite-or-switch-team.js.map
//# debugId=a656266c-5f4d-57a0-8ab9-20bc377cb7cc
