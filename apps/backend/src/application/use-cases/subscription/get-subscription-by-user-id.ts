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
      const validSubscription =
        await dependencies.subscriptionRepositoryDb.findActiveByUserId(userId);

      const today = new Date();
      const endDate = validSubscription?.endDate
        ? new Date(validSubscription.endDate)
        : null;
      const isExpired = endDate ? endDate < today : false;

      if (!validSubscription) {
        throw httpError("Předplatné se nepodařilo najít", 404);
      }

      if (
        isExpired &&
        validSubscription.status !== SubscriptionStatus.CANCELLED
      ) {
        const expiredSubscription =
          await dependencies.updateSubscriptionUseCase.execute(
            validSubscription?.id,
            { status: SubscriptionStatus.EXPIRED }
          );

        return expiredSubscription;
      } else {
        return validSubscription;
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
