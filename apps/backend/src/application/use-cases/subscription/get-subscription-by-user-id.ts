import { Subscription } from "@prisma/client";
import { SubscriptionRepositoryPort } from "../../ports/subscription-repository";
import subscriptionRepositoryDb from "../../../infrastructure/data/prisma/prisma-subscription-repository";

const createGetSubscriptionUseCase = (dependencies: {
  subscriptionRepositoryDb: SubscriptionRepositoryPort;
}) => {
  return {
    execute: async (userId: string): Promise<Subscription | null> => {
      return dependencies.subscriptionRepositoryDb.findByUserId(userId);
    },
  };
};

export type GetSubscriptionUseCaseType = ReturnType<
  typeof createGetSubscriptionUseCase
>;
const getSubscriptionUseCase = createGetSubscriptionUseCase({
  subscriptionRepositoryDb,
});

export default getSubscriptionUseCase;
