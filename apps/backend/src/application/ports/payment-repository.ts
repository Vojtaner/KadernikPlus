import { Payment } from ".prisma/client";
import { ComgateUpdatePaymentRequired } from "../services/comgatePaymentApi";

export interface PaymentRepositoryPort {
  create(
    paymentData: Omit<Payment, "id" | "createdAt" | "updatedAt">
  ): Promise<Payment>;
  updatePayment: (data: Partial<Payment>, id?: string) => Promise<Payment>;
  findByExternalId(externalId: string): Promise<Payment | null>;
}
