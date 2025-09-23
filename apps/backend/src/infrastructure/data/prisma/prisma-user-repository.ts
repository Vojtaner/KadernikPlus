import { UserCreateData } from "@/entities/user";
import { UserRepositoryPort } from "../../../application/ports/user-repository";
import { PrismaClient, User } from "@prisma/client";
import prisma from "./prisma";

const createUserRepositoryDb = (
  prismaUserRepository: PrismaClient
): UserRepositoryPort => ({
  add: async (userData: UserCreateData): Promise<User> => {
    const newUser = await prismaUserRepository.user.create({
      data: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        authProvider: userData.authProvider,
        lastLogin: userData.lastLogin,
      },
    });

    return newUser;
  },
  async findPendingDeletionUsers(now: Date): Promise<User[]> {
    const anonymizedUsers = await prismaUserRepository.user.findMany({
      where: {
        isDeleted: true,
        deletionScheduledAt: {
          lte: now,
        },
      },
    });

    return anonymizedUsers;
  },
  findById: async (id: string): Promise<User | null> => {
    const user = await prismaUserRepository.user.findUnique({
      where: { id },
    });

    return user;
  },
  update: async (
    userId: string,
    data: { bankAccount: string }
  ): Promise<User | null> => {
    const user = await prismaUserRepository.user.update({
      where: { id: userId },
      data: { ...data },
    });

    return user;
  },

  findByEmail: async (email: string): Promise<User | null> => {
    const user = await prismaUserRepository.user.findUnique({
      where: { email },
    });

    return user;
  },

  findAll: async (): Promise<User[]> => {
    const users = await prismaUserRepository.user.findMany();

    return users;
  },
});

const userRepositoryDb = createUserRepositoryDb(prisma);

export default userRepositoryDb;
