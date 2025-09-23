// application/use-cases/subscription/extend-subscription.ts
import { Subscription, SubscriptionStatus } from "@prisma/client";
import { SubscriptionRepositoryPort } from "../../ports/subscription-repository";
import subscriptionRepositoryDb from "../../../infrastructure/data/prisma/prisma-subscription-repository";
import { httpError } from "../../../adapters/express/httpError";
import recurringPaymentUseCase, {
  RecurringPaymentUseCaseType,
} from "../payment/recurring-payment";

const createExtendSubscriptionUseCase = (dependencies: {
  subscriptionRepositoryDb: SubscriptionRepositoryPort;
  recurringPaymentUseCase: RecurringPaymentUseCaseType;
}) => {
  return {
    execute: async (subscriptionId: string): Promise<Subscription | null> => {
      const subscription = await dependencies.subscriptionRepositoryDb.findById(
        subscriptionId
      );

      if (!subscription) {
        throw httpError("Předplatné se nepodařilo najít.", 404);
      }

      if (!subscription.endDate) {
        throw httpError("Předplatné nemá konec datumu platnosti.", 404);
      }

      const isSuccessfullyPaid =
        await dependencies.recurringPaymentUseCase.execute(subscription.id);

      if (!isSuccessfullyPaid) {
        throw httpError("Nepodařilo se provést opakovanou platbu.", 500);
      }

      const newEndDate = new Date(subscription.endDate);

      newEndDate.setDate(newEndDate.getDate() + 30);

      return dependencies.subscriptionRepositoryDb.update(subscription.id, {
        endDate: newEndDate,
        status: SubscriptionStatus.ACTIVE,
      });
    },
  };
};

export type ExtendSubscriptionUseCaseType = ReturnType<
  typeof createExtendSubscriptionUseCase
>;

const extendSubscriptionUseCase = createExtendSubscriptionUseCase({
  subscriptionRepositoryDb,
  recurringPaymentUseCase,
});

export default extendSubscriptionUseCase;
