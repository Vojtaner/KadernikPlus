// src/infrastructure/data/prisma/prisma-user-repository.ts
import { User, UserCreateData } from "@/entities/user";
import { UserRepository } from "@/application/ports/user-repository";
import { PrismaClient } from "@prisma/client";

/**
 * Prisma-based implementation of the UserRepository interface.
 * This class acts as an adapter, translating the generic UserRepository operations
 * into specific Prisma Client operations.
 */
export class PrismaUserRepository implements UserRepository {
  private prisma: PrismaClient;

  constructor(prismaClient: PrismaClient) {
    this.prisma = prismaClient;
  }

  /**
   * Inserts a new user into the database using Prisma.
   * Maps Prisma's User model back to the domain User entity.
   */
  async add(userData: UserCreateData): Promise<User> {
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
  async findById(id: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });
    return user ? this.toDomainUser(user) : null;
  }

  /**
   * Finds a user by email using Prisma.
   * Maps Prisma's User model back to the domain User entity.
   */
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.prisma.user.findUnique({
      where: { email },
    });
    return user ? this.toDomainUser(user) : null;
  }

  /**
   * Retrieves all users using Prisma.
   * Maps Prisma's User models back to domain User entities.
   */
  async findAll(): Promise<User[]> {
    const users = await this.prisma.user.findMany();
    return users.map(this.toDomainUser);
  }

  /**
   * Helper method to map a Prisma User object to a domain User entity.
   * This is important to ensure the domain layer only deals with its own defined types.
   */
  private toDomainUser(prismaUser: {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    authProvider: string | null;
    createdAt: Date;
    lastLogin: Date | null;
  }): User {
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
