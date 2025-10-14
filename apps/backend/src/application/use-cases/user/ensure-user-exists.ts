import { ManagementClient } from "auth0";
import userRepositoryDb from "../../../infrastructure/data/prisma/prisma-user-repository";
import addUserUseCase, { AddUserUseCaseType } from "./add-user";
import { UserRepositoryPort } from "@/application/ports/user-repository";
import { auth0ManagementApi } from "../../../application/services/auth0/auth0ManagementApi";
import { httpError } from "../../../adapters/express/httpError";
import dayjs from "dayjs";

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

      if (
        user &&
        user.isDeleted &&
        user.deletionScheduledAt !== null &&
        dayjs(user.deletionScheduledAt).isBefore(dayjs())
      ) {
        throw httpError(
          "Uživatel byl smazán a pod tímto účtem už se nelze přihlásit.",
          410
        );
      }

      if (!user) {
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

        await dependencies.addUserUseCase.execute({
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
