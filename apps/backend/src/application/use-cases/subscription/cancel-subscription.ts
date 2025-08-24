import subscriptionRepositoryDb from "../../../infrastructure/data/prisma/prisma-subscription-repository";
import { SubscriptionRepositoryPort } from "../../ports/subscription-repository";

const createCancelSubscriptionUseCase = (dependencies: {
  subscriptionRepositoryDb: SubscriptionRepositoryPort;
}) => {
  return {
    execute: async (id: string) => {
      return dependencies.subscriptionRepositoryDb.cancel(id);
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
