"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="cfceeef6-d8c8-5edd-b55d-dcf7c00cc178")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_client_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-client-repository"));
const prisma_team_member_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-team-member-repository"));
const createSearchClientsUseCase = (dependencies) => {
    return {
        execute: async (userId, query) => {
            if (!query) {
                return [];
            }
            const teamMember = await dependencies.teamMemberRepositoryDb.findUniqueMember(userId);
            if (!teamMember) {
                throw Error("User has no team assigned.");
            }
            const clients = await dependencies.clientRepositoryDb.search(teamMember.teamId, query, userId);
            return clients;
        },
    };
};
const searchClientsUseCase = createSearchClientsUseCase({
    clientRepositoryDb: prisma_client_repository_1.default,
    teamMemberRepositoryDb: prisma_team_member_repository_1.default,
});
exports.default = searchClientsUseCase;
//# sourceMappingURL=search-client.js.map
//# debugId=cfceeef6-d8c8-5edd-b55d-dcf7c00cc178
