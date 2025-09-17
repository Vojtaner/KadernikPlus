import subscriptionRepositoryDb from "../../../infrastructure/data/prisma/prisma-subscription-repository";
import { SubscriptionRepositoryPort } from "../../ports/subscription-repository";

const createCancelSubscriptionUseCase = (dependencies: {
  subscriptionRepositoryDb: SubscriptionRepositoryPort;
}) => {
  return {
    execute: async (subscriptionId: string) => {
      const cancelledSubscription =
        await dependencies.subscriptionRepositoryDb.cancel(subscriptionId);
      return cancelledSubscription;
    },
  };
};

export type CancelSubscriptionUseCaseType = ReturnType<
  typeof createCancelSubscriptionUseCase
>;

const cancelSubscriptionUseCase = createCancelSubscriptionUseCase({
  subscriptionRepositoryDb,
});
export default cancelSubscriptionUseCase;
