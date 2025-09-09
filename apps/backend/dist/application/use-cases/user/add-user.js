"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="970aa0d1-e4e2-5839-95db-e7078e767705")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_user_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-user-repository"));
const prisma_stock_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-stock-repository"));
const create_team_member_1 = __importDefault(require("../team-member/create-team-member"));
const create_team_1 = __importDefault(require("../team/create-team"));
class UserAlreadyExistsError extends Error {
    constructor(email) {
        super(`User with email ${email} already exists.`);
        this.name = "UserAlreadyExistsError";
    }
}
const createAddUserUseCase = (dependencies) => {
    return {
        execute: async (userData) => {
            if (!userData.id) {
                throw new Error("User could not be created.");
            }
            const existingUser = await dependencies.userRepositoryDb.findById(userData.id);
            if (existingUser) {
                throw new UserAlreadyExistsError(userData.email);
            }
            const newUser = await dependencies.userRepositoryDb.add(userData);
            const newTeam = await dependencies.createTeamUseCase.execute({
                name: `Tým - ${newUser.name}`,
            });
            const newTeamMember = await dependencies.createTeamMemberUseCase.execute({
                userId: newUser.id,
                teamId: newTeam.id,
            });
            const newStock = await dependencies.stockRepositoryDb.createStock(newUser.id, newTeam.id);
            return newUser;
        },
    };
};
const addUserUseCase = createAddUserUseCase({
    userRepositoryDb: prisma_user_repository_1.default,
    stockRepositoryDb: prisma_stock_repository_1.default,
    createTeamMemberUseCase: create_team_member_1.default,
    createTeamUseCase: create_team_1.default,
});
exports.default = addUserUseCase;
//# sourceMappingURL=add-user.js.map
//# debugId=970aa0d1-e4e2-5839-95db-e7078e767705
