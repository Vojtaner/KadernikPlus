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
