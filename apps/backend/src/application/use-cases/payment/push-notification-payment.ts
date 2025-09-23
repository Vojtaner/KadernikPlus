import { Payment } from "@prisma/client";
import { PaymentRepositoryPort } from "../../ports/payment-repository";
import paymentRepositoryDb from "../../../infrastructure/data/prisma/prisma-payment-repository";
import { SubscriptionRepositoryPort } from "../../../application/ports/subscription-repository";
import subscriptionRepositoryDb from "../../../infrastructure/data/prisma/prisma-subscription-repository";

const createPushNotificationPaymentUseCase = (dependencies: {
  paymentRepositoryDb: PaymentRepositoryPort;
  subscriptionRepositoryDb: SubscriptionRepositoryPort;
}) => ({
  execute: async (data: Partial<Payment>, id?: string) => {
    try {
      const updatedPayment =
        await dependencies.paymentRepositoryDb.updatePayment({
          transactionId: data.transactionId,
          status: data.status,
          initRecurringId: data.initRecurringId,
          refId: Number(data.refId),
        });

      const now = new Date();
      const plus30DaysDate = new Date(now);
      plus30DaysDate.setDate(now.getDate() + 30);
      if (updatedPayment && updatedPayment.status === "PAID") {
        const updatedSubscription =
          await dependencies.subscriptionRepositoryDb.update(
            updatedPayment.subscriptionId,
            {
              status: "ACTIVE",
              startDate: now,
              endDate: plus30DaysDate,
            }
          );

        return updatedSubscription;
      }
    } catch (error) {
      console.error("createPushNotificationPaymentUseCase", error);
      throw new Error("Platbu se nepovedlo zpracovat.");
    }
  },
});

export type UpdatePushNotificationPaymentUseCaseType = ReturnType<
  typeof createPushNotificationPaymentUseCase
>;

const updatePushNotificationPaymentUseCase =
  createPushNotificationPaymentUseCase({
    paymentRepositoryDb,
    subscriptionRepositoryDb,
  });

export default updatePushNotificationPaymentUseCase;
