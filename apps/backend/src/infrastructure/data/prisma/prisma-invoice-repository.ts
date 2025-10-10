import { PrismaClient } from ".prisma/client";
import { InvoiceRepositoryPort } from "../../../application/ports/invoice-repository";
import prisma from "./prisma";

const createInvoiceRepositoryDb = (
  prisma: PrismaClient
): InvoiceRepositoryPort => {
  return {
    findAll: async (userId: string) => {
      const invoices = await prisma.invoice.findMany({
        where: {
          OR: [
            { payment: { subscription: { userId } } },
            { payment: { refId: userId } },
          ],
        },
      });

      return invoices;
    },
    create: async (invoiceData) => {
      return prisma.invoice.create({
        data: invoiceData,
      });
    },
    findByNumber: async (invoiceNumber) => {
      return prisma.invoice.findUnique({
        where: { invoiceNumber },
      });
    },
    findLastByYear: async (year: number) => {
      const invoice = await prisma.invoice.findFirst({
        where: { year },
        orderBy: { sequence: "desc" },
      });

      return invoice;
    },
  };
};

const invoiceRepositoryDb = createInvoiceRepositoryDb(prisma);
export default invoiceRepositoryDb;
