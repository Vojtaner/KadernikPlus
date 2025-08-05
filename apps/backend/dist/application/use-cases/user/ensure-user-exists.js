"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnsureUserExists = void 0;
const prisma_user_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-user-repository"));
const auth0ManagementApi_1 = require("../../services/auth0ManagementApi");
const add_user_1 = __importDefault(require("./add-user"));
const createEnsureUserExists = (dependencies) => {
    return {
        execute: async (userId) => {
            if (!userId) {
                throw new Error("User could not be created.");
            }
            const user = await dependencies.userRepositoryDb.findById(userId);
            if (!user) {
                const { data: { email, name }, } = await dependencies.auth0ManagementApi.users.get({
                    id: userId,
                });
                const user = await dependencies.addUserUseCase.execute({
                    email,
                    id: userId,
                    name,
                    authProvider: "auth0",
                });
                // await dependencies.userRepositoryDb.add({
                //   id: userId,
                //   email: email,
                //   name: name,
                //   authProvider: "auth0",
                // });
            }
        },
    };
};
exports.createEnsureUserExists = createEnsureUserExists;
const ensureUserExistsUseCase = (0, exports.createEnsureUserExists)({
    addUserUseCase: add_user_1.default,
    userRepositoryDb: prisma_user_repository_1.default,
    auth0ManagementApi: auth0ManagementApi_1.auth0ManagementApi,
});
exports.default = ensureUserExistsUseCase;
