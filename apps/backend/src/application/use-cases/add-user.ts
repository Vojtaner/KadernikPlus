import { User, UserCreateData } from "@/entities/user";
import { UserRepositoryPort } from "../../application/ports/user-repository";
import userRepositoryDb from "../../infrastructure/data/prisma/prisma-user-repository";

class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User with email ${email} already exists.`);
    this.name = "UserAlreadyExistsError";
  }
}

const createAddUserUseCase = (dependencies: {
  userRepositoryDb: UserRepositoryPort;
}) => {
  return {
    execute: async (userData: UserCreateData): Promise<User> => {
      const existingUser = await dependencies.userRepositoryDb.findByEmail(
        userData.email
      );
      if (existingUser) {
        throw new UserAlreadyExistsError(userData.email);
      }

      const newUser = await dependencies.userRepositoryDb.add(userData);

      return newUser;
    },
  };
};

export type AddUserUseCaseType = ReturnType<typeof createAddUserUseCase>;
const addUserUseCase = createAddUserUseCase({ userRepositoryDb });

export default addUserUseCase;
