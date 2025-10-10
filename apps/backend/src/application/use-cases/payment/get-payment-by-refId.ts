import { PaymentRepositoryPort } from "../../ports/payment-repository";
import paymentRepositoryDb from "../../../infrastructure/data/prisma/prisma-payment-repository";

const createGetPaymentByRefIdUseCase = (dependencies: {
  paymentRepositoryDb: PaymentRepositoryPort;
}) => ({
  execute: async (refId: string) => {
    return await dependencies.paymentRepositoryDb.getPaymentByRefId(refId);
  },
});

export type GetPaymentByRefIdUseCaseType = ReturnType<
  typeof createGetPaymentByRefIdUseCase
>;

const getPaymentByRefIdUseCase = createGetPaymentByRefIdUseCase({
  paymentRepositoryDb,
});

export default getPaymentByRefIdUseCase;
