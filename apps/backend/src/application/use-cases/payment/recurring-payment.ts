import { PaymentRepositoryPort } from "../../ports/payment-repository";
import paymentRepositoryDb from "../../../infrastructure/data/prisma/prisma-payment-repository";
import { Payment } from ".prisma/client";

const createRecurringPaymentUseCase = (dependencies: {
  paymentRepositoryDb: PaymentRepositoryPort;
}) => ({
  execute: async (
    paymentData: Omit<Payment, "id" | "createdAt" | "updatedAt">
  ) => {
    return dependencies.paymentRepositoryDb.create(paymentData);
  },
});

export type RecurringPaymentUseCaseType = ReturnType<
  typeof createRecurringPaymentUseCase
>;

const recurringPaymentUseCase = createRecurringPaymentUseCase({
  paymentRepositoryDb,
});

export default recurringPaymentUseCase;
