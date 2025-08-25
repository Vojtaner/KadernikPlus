import { PaymentRepositoryPort } from "../../../application/ports/payment-repository";
import { Payment, PrismaClient } from ".prisma/client";
import prisma from "./prisma";

const createProcedureRepositoryDb = (
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
      console.log({ updatePayment: data });
      if (!id && !data.refId) {
        console.log("chyba", data);
        throw new Error("Platbu nelze aktualizovat chybí ID nebo REFID.");
      }

      try {
        if (data.refId) {
          console.log("refId", data.refId, typeof data.refId);
          const updatedPayment = await prisma.payment.update({
            where: { refId: data.refId },
            data,
          });

          console.log({ updatedPayment, nic: "dsfdsf" });

          const now = new Date();
          const plus30DaysDate = new Date(now); // clone date
          plus30DaysDate.setDate(now.getDate() + 30);

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

        if (id) {
          console.log("id", data.id, typeof data.id);
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

    findByExternalId: async (transactionId: string) => {
      const payment = await prismaClient.payment.findUnique({
        where: { transactionId },
      });

      return payment;
    },
  };
};

const procedureRepositoryDb = createProcedureRepositoryDb(prisma);
export default procedureRepositoryDb;
