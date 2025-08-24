import { Subscription } from "@prisma/client";
import subscriptionRepositoryDb from "../../../infrastructure/data/prisma/prisma-subscription-repository";
import { SubscriptionRepositoryPort } from "@/application/ports/subscription-repository";

const createUpdateSubscriptionUseCase = (dependencies: {
  subscriptionRepositoryDb: SubscriptionRepositoryPort;
}) => ({
  execute: async (id: string, data: Partial<Subscription>) => {
    const updatedSubscription =
      await dependencies.subscriptionRepositoryDb.update(id, data);

    return updatedSubscription;
  },
});

export type UpdateSubscriptionUseCaseType = ReturnType<
  typeof createUpdateSubscriptionUseCase
>;

const updateSubscriptionUseCase = createUpdateSubscriptionUseCase({
  subscriptionRepositoryDb,
});

export default updateSubscriptionUseCase;
