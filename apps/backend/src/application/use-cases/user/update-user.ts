import userRepositoryDb from "../../../infrastructure/data/prisma/prisma-user-repository";
import { UserRepositoryPort } from "../../../application/ports/user-repository";

const createUpdateUserUseCase = (dependencies: {
  userRepositoryDb: UserRepositoryPort;
}) => ({
  execute: async (
    userId: string,
    data: { bankAccount: string; reviewUrl: string }
  ) => {
    const updatedUser = await dependencies.userRepositoryDb.update(
      userId,
      data
    );

    return updatedUser;
  },
});

export type UpdateUserUseCaseType = ReturnType<typeof createUpdateUserUseCase>;

const updateUserUseCase = createUpdateUserUseCase({
  userRepositoryDb,
});

export default updateUserUseCase;
