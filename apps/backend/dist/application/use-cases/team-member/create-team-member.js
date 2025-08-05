"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_team_member_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-team-member-repository"));
const createCreateTeamMemberUseCase = (dependencies) => {
    return {
        execute: async (data) => {
            //team zjisit na základe userID
            //ověřit že není již v jiném týmu
            //co se stane s bývalým týmem uživatele pozvaného do jiného týmu?
            // najít shodu mezi emailem a 4posledníma znaky userID
            const newTeamMember = await dependencies.teamMemberRepositoryDb.create({
                userId: data.userId,
                teamId: data.teamId,
                canAccessStocks: true,
                canAccessClients: true,
                canAccessVisits: true,
            });
            return newTeamMember;
        },
    };
};
const createTeamMemberUseCase = createCreateTeamMemberUseCase({
    teamMemberRepositoryDb: prisma_team_member_repository_1.default,
});
exports.default = createTeamMemberUseCase;
