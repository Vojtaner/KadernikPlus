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
        try {
          const managementApiData =
            await dependencies.auth0ManagementApi.users.get({
              id: userId,
            });

          const {
            data: { email, name },
          } = managementApiData;

          if (!managementApiData) {
            throw new Error("Špatně nastavená pravidla v Auth0.");
          }

          const user = await dependencies.addUserUseCase.execute({
            email,
            id: userId,
            name,
            authProvider: "auth0",
          });
        } catch (error) {
          console.error("createEnsureUserExists", error);
          throw new Error("Chyba v ověřování uživatele.");
        }
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
