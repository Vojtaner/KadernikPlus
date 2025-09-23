import { PaymentRepositoryPort } from "../../../application/ports/payment-repository";
import { Payment, PrismaClient } from ".prisma/client";
import prisma from "./prisma";
import { httpError } from "../../../adapters/express/httpError";

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
        if (data.refId) {
          const updatedPayment = await prisma.payment.update({
            where: { refId: data.refId },
            data,
          });

          return updatedPayment;
        }

        if (id) {
          const updatedPayment = await prisma.payment.update({
            where: { id },
            data,
          });

          return updatedPayment;
        }
      } catch (error) {
        console.error("prismaPaymentRepositoryDb - updatePayment error", error);
        throw new Error("Platbu nelze aktualizovat.");
      }
    },
    findByExternalId: async (transactionId: string) => {
      const payment = await prismaClient.payment.findUnique({
        where: { transactionId },
      });

      return payment;
    },
    findBySubscriptionId: async (subscriptionId: string) => {
      const alreadyPendingPayment = await prismaClient.payment.findFirst({
        where: { subscriptionId, status: "PENDING" },
      });

      if (alreadyPendingPayment) {
        throw httpError(
          "Pro toto předplatné již existuje čekající platba.",
          400
        );
      }

      const lastPaidPayment = await prismaClient.payment.findFirst({
        where: { subscriptionId, status: "PAID" },
      });

      return lastPaidPayment;
    },
  };
};

const paymentRepositoryDb = createPaymentRepositoryDb(prisma);
export default paymentRepositoryDb;
