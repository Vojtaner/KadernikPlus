import { Payment } from ".prisma/client";

export interface PaymentRepositoryPort {
  create(
    paymentData: Omit<Payment, "id" | "createdAt" | "updatedAt">
  ): Promise<Payment>;
  updatePayment: (
    data: Partial<Payment>,
    id?: string
  ) => Promise<Payment | undefined>;
  getPaymentByRefId: (refId: string) => Promise<Payment | null>;
  findByExternalId(externalId: string): Promise<Payment | null>;
  findBySubscriptionId(subscriptionId: string): Promise<Payment | null>;
}
