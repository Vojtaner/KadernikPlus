import { Subscription, SubscriptionStatus } from "@prisma/client";
import { SubscriptionRepositoryPort } from "../../ports/subscription-repository";
import subscriptionRepositoryDb from "../../../infrastructure/data/prisma/prisma-subscription-repository";
import updateSubscriptionUseCase, {
  UpdateSubscriptionUseCaseType,
} from "./update-subscription";
import { httpError } from "../../../adapters/express/httpError";

const createGetSubscriptionUseCase = (dependencies: {
  subscriptionRepositoryDb: SubscriptionRepositoryPort;
  updateSubscriptionUseCase: UpdateSubscriptionUseCaseType;
}) => {
  return {
    execute: async (userId: string): Promise<Subscription | null> => {
      const userSubscription =
        await dependencies.subscriptionRepositoryDb.findByUserId(userId);

      const isExpired = getIsSubscriptionExpired(userSubscription?.endDate);

      if (!userSubscription) {
        throw httpError("Předplatné se nepodařilo najít", 404);
      }

      if (
        isExpired &&
        userSubscription.status !== SubscriptionStatus.CANCELLED
      ) {
        const expiredSubscription =
          await dependencies.updateSubscriptionUseCase.execute(
            userSubscription?.id,
            { status: SubscriptionStatus.EXPIRED }
          );

        return expiredSubscription;
      } else {
        return userSubscription;
      }
    },
  };
};

export type GetSubscriptionUseCaseType = ReturnType<
  typeof createGetSubscriptionUseCase
>;
const getSubscriptionUseCase = createGetSubscriptionUseCase({
  subscriptionRepositoryDb,
  updateSubscriptionUseCase,
});

export default getSubscriptionUseCase;

const getIsSubscriptionExpired = (endDate: Date | null | undefined) => {
  const today = new Date();
  const isExpired = endDate ? endDate < today : false;
  return isExpired;
};
