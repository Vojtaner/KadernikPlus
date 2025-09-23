import { Payment } from ".prisma/client";

export interface PaymentRepositoryPort {
  create(
    paymentData: Omit<Payment, "id" | "createdAt" | "updatedAt">
  ): Promise<Payment>;
  updatePayment: (
    data: Partial<Payment>,
    id?: string
  ) => Promise<Payment | undefined>;

  findByExternalId(externalId: string): Promise<Payment | null>;
  findBySubscriptionId(subscriptionId: string): Promise<Payment | null>;
}
