import { User, UserCreateData } from "@/entities/user";
import { UserRepositoryPort } from "../../ports/user-repository";
import userRepositoryDb from "../../../infrastructure/data/prisma/prisma-user-repository";
import { StockRepositoryPort } from "../../ports/stock-repository";
import stockRepositoryDb from "../../../infrastructure/data/prisma/prisma-stock-repository";

class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User with email ${email} already exists.`);
    this.name = "UserAlreadyExistsError";
  }
}

const createAddUserUseCase = (dependencies: {
  userRepositoryDb: UserRepositoryPort;
  stockRepositoryDb: StockRepositoryPort;
}) => {
  return {
    execute: async (userData: UserCreateData): Promise<User> => {
      const existingUser = await dependencies.userRepositoryDb.findById(
        userData.id
      );

      if (existingUser) {
        throw new UserAlreadyExistsError(userData.email);
      }

      const newUser = await dependencies.userRepositoryDb.add(userData);
      const newStock = await dependencies.stockRepositoryDb.createStock(
        newUser.id
      );

      return newUser;
    },
  };
};

export type AddUserUseCaseType = ReturnType<typeof createAddUserUseCase>;
const addUserUseCase = createAddUserUseCase({
  userRepositoryDb,
  stockRepositoryDb,
});

export default addUserUseCase;
