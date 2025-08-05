"use strict";
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
