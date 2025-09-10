import { UserRepositoryPort } from "../../ports/user-repository";
import userRepositoryDb from "../../../infrastructure/data/prisma/prisma-user-repository";
import { User } from "@prisma/client";

const UserNotFoundError = (id: string) => {
  const error = new Error(`User with ID ${id} not found.`);
  error.name = "UserNotFoundError";
  throw error;
};

const createGetUserByIdUseCase = (dependencies: {
  userRepositoryDb: UserRepositoryPort;
}) => {
  return {
    execute: async (userId: string): Promise<User> => {
      const user = await dependencies.userRepositoryDb.findById(userId);

      if (!user) {
        return UserNotFoundError(userId);
      }

      return user;
    },
  };
};

const getUserByIdUseCase = createGetUserByIdUseCase({ userRepositoryDb });
export type GetUserByIdUseCaseType = ReturnType<
  typeof createGetUserByIdUseCase
>;

export default getUserByIdUseCase;
