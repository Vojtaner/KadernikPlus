import { ManagementClient } from "auth0";
import { UserRepositoryPort } from "../../ports/user-repository";
import userRepositoryDb from "../../../infrastructure/data/prisma/prisma-user-repository";
import { auth0ManagementApi } from "../../services/auth0ManagementApi";

export const createEnsureUserExists = (dependencies: {
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

        await dependencies.userRepositoryDb.add({
          id: userId,
          email: email,
          name: name,
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
  userRepositoryDb,
  auth0ManagementApi,
});

export default ensureUserExistsUseCase;
