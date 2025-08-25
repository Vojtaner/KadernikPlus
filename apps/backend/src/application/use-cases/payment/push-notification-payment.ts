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
          refId: Number(data.refId),
        });
      if (updatedPayment)
        console.log("UpdatedPayment keys:", Object.keys(updatedPayment));

      console.log(
        "UpdatedPayment JSON:",
        JSON.stringify(updatedPayment, null, 2)
      );

      const now = new Date();
      const plus30DaysDate = new Date(now); // clone date
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
      console.log("error po platbě");
    } catch (error) {
      console.log("createPushNotificationPaymentUseCase", error);
      throw new Error("Platbu se nepovedlo zpracovat.");
    }
  },
});

export type UpdatePaymentUseCaseType = ReturnType<
  typeof createPushNotificationPaymentUseCase
>;

const updatePaymentUseCase = createPushNotificationPaymentUseCase({
  paymentRepositoryDb,
  subscriptionRepositoryDb,
});

export default updatePaymentUseCase;
