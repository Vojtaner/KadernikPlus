import userRepositoryDb from "../../../infrastructure/data/prisma/prisma-user-repository";
import { UserRepositoryPort } from "../../../application/ports/user-repository";
import cancelSubscriptionUseCase, {
  CancelSubscriptionUseCaseType,
} from "../subscription/cancel-subscription";
import { SubscriptionRepositoryPort } from "@/application/ports/subscription-repository";
import { httpError } from "../../../adapters/express/httpError";
import subscriptionRepositoryDb from "../../../infrastructure/data/prisma/prisma-subscription-repository";

const createDeleteUserUseCase = (dependencies: {
  userRepositoryDb: UserRepositoryPort;
  cancelSubscriptionUseCase: CancelSubscriptionUseCaseType;
  subscriptionRepositoryDb: SubscriptionRepositoryPort;
}) => ({
  execute: async (userId: string) => {
    const subscription =
      await dependencies.subscriptionRepositoryDb.findActiveByUserId(userId);

    if (!subscription) {
      throw httpError("Nebylo nalezeno aktivní předplatné uživatele", 404);
    }

    await dependencies.cancelSubscriptionUseCase.execute(subscription.id);

    const markDeletedUser = await dependencies.userRepositoryDb.update(userId, {
      isDeleted: true,
      deletionScheduledAt: subscription.endDate,
    });

    return markDeletedUser;
  },
});

export type DeleteUserUseCaseType = ReturnType<typeof createDeleteUserUseCase>;

const deleteUserUseCase = createDeleteUserUseCase({
  userRepositoryDb,
  cancelSubscriptionUseCase,
  subscriptionRepositoryDb,
});

export default deleteUserUseCase;
