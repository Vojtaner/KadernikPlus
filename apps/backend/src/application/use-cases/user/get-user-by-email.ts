import { UserRepositoryPort } from "../../ports/user-repository";
import userRepositoryDb from "../../../infrastructure/data/prisma/prisma-user-repository";
import { User } from "@prisma/client";

const UserNotFoundError = (id: string) => {
  const error = new Error(`User with email ${id} not found.`);
  error.name = "UserNotFoundError";
  throw error;
};

const createGetUserByEmailUseCase = (dependencies: {
  userRepositoryDb: UserRepositoryPort;
}) => {
  return {
    execute: async (email: string): Promise<User> => {
      const user = await dependencies.userRepositoryDb.findByEmail(email);

      if (!user) {
        return UserNotFoundError(email);
      }

      return user;
    },
  };
};

const getUserByEmailUseCase = createGetUserByEmailUseCase({ userRepositoryDb });
export type GetUserByEmailUseCaseType = ReturnType<
  typeof createGetUserByEmailUseCase
>;

export default getUserByEmailUseCase;
