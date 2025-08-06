import { ManagementClient } from "auth0";
import userRepositoryDb from "../../../infrastructure/data/prisma/prisma-user-repository";
import { auth0ManagementApi } from "../../services/auth0ManagementApi";
import addUserUseCase, { AddUserUseCaseType } from "./add-user";
import { UserRepositoryPort } from "@/application/ports/user-repository";

export const createEnsureUserExists = (dependencies: {
  addUserUseCase: AddUserUseCaseType;
  userRepositoryDb: UserRepositoryPort;
  auth0ManagementApi: ManagementClient;
}) => {
  return {
    execute: async (userId: string) => {
      if (!userId) {
        throw new Error("User could not be created.");
      }

      const user = await dependencies.userRepositoryDb.findById(userId);

      if (!user) {
        const {
          data: { email, name },
        } = await dependencies.auth0ManagementApi.users.get({
          id: userId,
        });

        const user = await dependencies.addUserUseCase.execute({
          email,
          id: userId,
          name,
          authProvider: "auth0",
        });
      }
    },
  };
};

export type EnsureUserExistsUseCaseType = ReturnType<
  typeof createEnsureUserExists
>;
const ensureUserExistsUseCase = createEnsureUserExists({
  addUserUseCase,
  userRepositoryDb,
  auth0ManagementApi,
});

export default ensureUserExistsUseCase;
