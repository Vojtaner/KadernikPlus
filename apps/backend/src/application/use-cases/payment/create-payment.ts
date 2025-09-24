import { PaymentRepositoryPort } from "../../ports/payment-repository";
import paymentRepositoryDb from "../../../infrastructure/data/prisma/prisma-payment-repository";
import { Payment } from ".prisma/client";

const createCreatePaymentUseCase = (dependencies: {
  paymentRepositoryDb: PaymentRepositoryPort;
}) => ({
  execute: async (
    paymentData: Omit<Payment, "id" | "createdAt" | "updatedAt">
  ) => {
    return dependencies.paymentRepositoryDb.create(paymentData);
  },
});

export type CreatePaymentUseCaseType = ReturnType<
  typeof createCreatePaymentUseCase
>;

const createPaymentUseCase = createCreatePaymentUseCase({
  paymentRepositoryDb,
});

export default createPaymentUseCase;

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  CANCELLED = "CANCELLED",
  AUTHORIZED = "AUTHORIZED",
}
