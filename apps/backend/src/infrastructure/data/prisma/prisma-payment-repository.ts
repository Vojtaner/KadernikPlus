import { PaymentRepositoryPort } from "../../../application/ports/payment-repository";
import { Payment, PrismaClient } from ".prisma/client";
import prisma from "./prisma";

const createPaymentRepositoryDb = (
  prismaClient: PrismaClient
): PaymentRepositoryPort => {
  return {
    create: async (paymentData) => {
      const payment = await prismaClient.payment.create({
        data: paymentData,
      });
      return payment;
    },

    updatePayment: async (data: Partial<Payment>, id) => {
      if (!id && !data.refId) {
        throw new Error("Platbu nelze aktualizovat chybí ID nebo REFID.");
      }

      try {
        if (id) {
          const updatedPayment = await prisma.payment.update({
            where: { id },
            data,
          });

          return updatedPayment;
        }
      } catch (error) {
        console.log("prismaPaymentRepositoryDb - updatePayment error", error);
        throw new Error("Platbu nelze aktualizovat.");
      }
    },
    updatePaymentAndSubscription: async (data: Partial<Payment>, id) => {
      if (!data.refId) {
        throw new Error("Platbu nelze aktualizovat chybí REFID.");
      }

      try {
        const updatedPayment = await prisma.payment.update({
          where: { refId: data.refId },
          data,
        });

        const now = new Date();
        const plus30DaysDate = new Date(now); // clone date
        plus30DaysDate.setDate(now.getDate() + 30);

        if (updatedPayment.status === "PAID") {
          const updatedSubscription = await prisma.subscription.update({
            where: { id: updatedPayment.subscriptionId },
            data: {
              status: "ACTIVE",
              startDate: now,
              endDate: plus30DaysDate,
            },
          });

          return updatedPayment;
        }
        return updatedPayment;
      } catch (error) {
        console.log("prismaPaymentRepositoryDb - updatePayment error", error);
        throw new Error("Platbu nelze aktualizovat.");
      }
    },

    findByExternalId: async (transactionId: string) => {
      const payment = await prismaClient.payment.findUnique({
        where: { transactionId },
      });

      return payment;
    },
  };
};

const paymentRepositoryDb = createPaymentRepositoryDb(prisma);
export default paymentRepositoryDb;
