"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="9dd213a9-4149-5e92-a746-a58b9130b20d")}catch(e){}}();

var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createEnsureUserExists = void 0;
const prisma_user_repository_1 = __importDefault(require("../../../infrastructure/data/prisma/prisma-user-repository"));
const add_user_1 = __importDefault(require("./add-user"));
const auth0ManagementApi_1 = require("../../../application/services/auth0/auth0ManagementApi");
const createEnsureUserExists = (dependencies) => {
    return {
        execute: async (userId) => {
            if (!userId) {
                throw new Error("User could not be created.");
            }
            const user = await dependencies.userRepositoryDb.findById(userId);
            if (!user) {
                try {
                    const managementApiData = await dependencies.auth0ManagementApi.users.get({
                        id: userId,
                    });
                    const { data: { email, name }, } = managementApiData;
                    if (!managementApiData) {
                        throw new Error("Špatně nastavená pravidla v Auth0.");
                    }
                    const user = await dependencies.addUserUseCase.execute({
                        email,
                        id: userId,
                        name,
                        authProvider: "auth0",
                    });
                }
                catch (error) {
                    console.error("createEnsureUserExists", error);
                    throw new Error("Chyba v ověřování uživatele.");
                }
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
//# sourceMappingURL=ensure-user-exists.js.map
//# debugId=9dd213a9-4149-5e92-a746-a58b9130b20d
