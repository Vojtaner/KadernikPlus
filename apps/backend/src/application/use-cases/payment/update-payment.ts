import { Payment } from "@prisma/client";
import { PaymentRepositoryPort } from "../../ports/payment-repository";
import paymentRepositoryDb from "../../../infrastructure/data/prisma/prisma-payment-repository";

const createUpdatePaymentUseCase = (dependencies: {
  paymentRepositoryDb: PaymentRepositoryPort;
}) => ({
  execute: async (data: Partial<Payment>, id?: string) => {
    return await dependencies.paymentRepositoryDb.updatePayment(data, id);
  },
});

export type UpdatePaymentUseCaseType = ReturnType<
  typeof createUpdatePaymentUseCase
>;

const updatePaymentUseCase = createUpdatePaymentUseCase({
  paymentRepositoryDb,
});

export default updatePaymentUseCase;
