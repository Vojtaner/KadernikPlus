import { Invoice } from ".prisma/client";

export enum InvoiceStatus {
  PAID = "PAID",
  CANCELLED = "CANCELLED",
  PENDING = "PENDING",
}

export interface InvoiceRepositoryPort {
  create: (
    invoiceData: Omit<Invoice, "id" | "createdAt" | "updatedAt">
  ) => Promise<Invoice>;
  findByNumber?: (invoiceNumber: string) => Promise<Invoice | null>;
  findLastByYear: (year: number) => Promise<Invoice | null>;
}
