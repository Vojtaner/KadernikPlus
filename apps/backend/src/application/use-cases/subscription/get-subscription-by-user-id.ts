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
      const subscription =
        await dependencies.subscriptionRepositoryDb.findByUserId(userId);

      const today = new Date();
      const endDate = subscription?.endDate
        ? new Date(subscription.endDate)
        : null;
      const isExpired = endDate ? endDate < today : false;

      if (!subscription) {
        throw httpError("Předplatné se nepodařilo najít", 404);
      }

      if (isExpired && subscription.status !== SubscriptionStatus.CANCELLED) {
        const expiredSubscription =
          await dependencies.updateSubscriptionUseCase.execute(
            subscription?.id,
            { status: SubscriptionStatus.EXPIRED }
          );

        return expiredSubscription;
      } else {
        return subscription;
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
