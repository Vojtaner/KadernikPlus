import { User, UserCreateData } from "@/entities/user";
import { UserRepositoryPort } from "../../ports/user-repository";
import userRepositoryDb from "../../../infrastructure/data/prisma/prisma-user-repository";
import { StockRepositoryPort } from "../../ports/stock-repository";
import stockRepositoryDb from "../../../infrastructure/data/prisma/prisma-stock-repository";
import createTeamMemberUseCase, {
  CreateTeamMemberUseCaseType,
} from "../team-member/create-team-member";
import createTeamUseCase, { CreateTeamUseCaseType } from "../team/create-team";

class UserAlreadyExistsError extends Error {
  constructor(email: string) {
    super(`User with email ${email} already exists.`);
    this.name = "UserAlreadyExistsError";
  }
}

const createAddUserUseCase = (dependencies: {
  userRepositoryDb: UserRepositoryPort;
  stockRepositoryDb: StockRepositoryPort;
  createTeamMemberUseCase: CreateTeamMemberUseCaseType;
  createTeamUseCase: CreateTeamUseCaseType;
}) => {
  return {
    execute: async (userData: UserCreateData): Promise<User> => {
      if (!userData.id) {
        throw new Error("User could not be created.");
      }

      const existingUser = await dependencies.userRepositoryDb.findById(
        userData.id
      );

      if (existingUser) {
        throw new UserAlreadyExistsError(userData.email);
      }

      const newUser = await dependencies.userRepositoryDb.add(userData);

      const newTeam = await dependencies.createTeamUseCase.execute({
        name: `Tým - ${newUser.name}`,
        userId: newUser.id,
      });

      const newTeamMember = await dependencies.createTeamMemberUseCase.execute({
        userId: newUser.id,
        teamId: newTeam.id,
      });

      const newStock = await dependencies.stockRepositoryDb.createStock(
        newUser.id,
        newTeam.id
      );

      return newUser;
    },
  };
};

export type AddUserUseCaseType = ReturnType<typeof createAddUserUseCase>;
const addUserUseCase = createAddUserUseCase({
  userRepositoryDb,
  stockRepositoryDb,
  createTeamMemberUseCase,
  createTeamUseCase,
});

export default addUserUseCase;
