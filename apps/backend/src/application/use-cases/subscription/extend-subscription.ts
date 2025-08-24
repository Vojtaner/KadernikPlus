// application/use-cases/subscription/extend-subscription.ts
import { Subscription } from "@prisma/client";
import { SubscriptionRepositoryPort } from "../../ports/subscription-repository";
import subscriptionRepositoryDb from "../../../infrastructure/data/prisma/prisma-subscription-repository";

const createExtendSubscriptionUseCase = (dependencies: {
  subscriptionRepositoryDb: SubscriptionRepositoryPort;
}) => {
  return {
    execute: async (
      userId: string,
      extraDays: number
    ): Promise<Subscription | null> => {
      const active =
        await dependencies.subscriptionRepositoryDb.findActiveByUserId(userId);

      if (!active) {
        return null;
      }
      if (!active.endDate) {
        throw new Error("Předplatné nemá konec datumu platnosti.");
      }

      const newEndDate = new Date(active.endDate);
      newEndDate.setDate(newEndDate.getDate() + extraDays);

      return dependencies.subscriptionRepositoryDb.update(active.id, {
        endDate: newEndDate,
      });
    },
  };
};

export type ExtendSubscriptionUseCaseType = ReturnType<
  typeof createExtendSubscriptionUseCase
>;

const extendSubscriptionUseCase = createExtendSubscriptionUseCase({
  subscriptionRepositoryDb,
});

export default extendSubscriptionUseCase;
