"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaUserRepository = void 0;
/**
 * Prisma-based implementation of the UserRepository interface.
 * This class acts as an adapter, translating the generic UserRepository operations
 * into specific Prisma Client operations.
 */
class PrismaUserRepository {
    constructor(prismaClient) {
        this.prisma = prismaClient;
    }
    /**
     * Inserts a new user into the database using Prisma.
     * Maps Prisma's User model back to the domain User entity.
     */
    async add(userData) {
        const newUser = await this.prisma.user.create({
            data: {
                name: userData.name,
                email: userData.email,
                passwordHash: userData.passwordHash,
                authProvider: userData.authProvider,
                lastLogin: userData.lastLogin,
                // createdAt is @default(now()) in Prisma schema, so it's automatically handled
            },
        });
        // Map Prisma model to domain entity
        return this.toDomainUser(newUser);
    }
    /**
     * Finds a user by ID using Prisma.
     * Maps Prisma's User model back to the domain User entity.
     */
    async findById(id) {
        const user = await this.prisma.user.findUnique({
            where: { id },
        });
        return user ? this.toDomainUser(user) : null;
    }
    /**
     * Finds a user by email using Prisma.
     * Maps Prisma's User model back to the domain User entity.
     */
    async findByEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        return user ? this.toDomainUser(user) : null;
    }
    /**
     * Retrieves all users using Prisma.
     * Maps Prisma's User models back to domain User entities.
     */
    async findAll() {
        const users = await this.prisma.user.findMany();
        return users.map(this.toDomainUser);
    }
    /**
     * Helper method to map a Prisma User object to a domain User entity.
     * This is important to ensure the domain layer only deals with its own defined types.
     */
    toDomainUser(prismaUser) {
        return {
            id: prismaUser.id,
            name: prismaUser.name,
            email: prismaUser.email,
            passwordHash: prismaUser.passwordHash,
            authProvider: prismaUser.authProvider,
            createdAt: prismaUser.createdAt,
            lastLogin: prismaUser.lastLogin,
        };
    }
}
exports.PrismaUserRepository = PrismaUserRepository;
