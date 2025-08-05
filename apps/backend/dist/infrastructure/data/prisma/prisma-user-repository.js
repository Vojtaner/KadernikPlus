"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_mapper_1 = __importDefault(require("../../../infrastructure/mappers/user-mapper"));
const prisma_1 = __importDefault(require("./prisma"));
const createUserRepositoryDb = (prismaUserRepository) => ({
    add: async (userData) => {
        const newUser = await prismaUserRepository.user.create({
            data: {
                id: userData.id,
                name: userData.name,
                email: userData.email,
                authProvider: userData.authProvider,
                lastLogin: userData.lastLogin,
            },
        });
        return (0, user_mapper_1.default)(newUser);
    },
    findById: async (id) => {
        const user = await prismaUserRepository.user.findUnique({
            where: { id },
        });
        return user ? (0, user_mapper_1.default)(user) : null;
    },
    findByEmail: async (email) => {
        const user = await prismaUserRepository.user.findUnique({
            where: { email },
        });
        return user ? (0, user_mapper_1.default)(user) : null;
    },
    findAll: async () => {
        const users = await prismaUserRepository.user.findMany();
        return users.map(user_mapper_1.default);
    },
});
const userRepositoryDb = createUserRepositoryDb(prisma_1.default);
exports.default = userRepositoryDb;
