import { User, UserCreateData } from "@/entities/user";
import { UserRepositoryPort } from "../../../application/ports/user-repository";
import { PrismaClient } from "@prisma/client";
import mapToDomainUser from "../../../infrastructure/mappers/user-mapper";
import prisma from "./prisma";

const createUserRepositoryDb = (
  prismaUserRepository: PrismaClient
): UserRepositoryPort => ({
  add: async (userData: UserCreateData): Promise<User> => {
    const newUser = await prismaUserRepository.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        passwordHash: userData.passwordHash,
        authProvider: userData.authProvider,
        lastLogin: userData.lastLogin,
      },
    });

    return mapToDomainUser(newUser);
  },

  findById: async (id: string): Promise<User | null> => {
    const user = await prismaUserRepository.user.findUnique({
      where: { id },
    });

    return user ? mapToDomainUser(user) : null;
  },

  findByEmail: async (email: string): Promise<User | null> => {
    const user = await prismaUserRepository.user.findUnique({
      where: { email },
    });

    return user ? mapToDomainUser(user) : null;
  },

  findAll: async (): Promise<User[]> => {
    const users = await prismaUserRepository.user.findMany();

    return users.map(mapToDomainUser);
  },
});

const userRepositoryDb = createUserRepositoryDb(prisma);

export default userRepositoryDb;
