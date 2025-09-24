import { Invoice } from "@prisma/client";
import { InvoiceRepositoryPort } from "../../ports/invoice-repository";
import invoiceRepositoryDb from "../../../infrastructure/data/prisma/prisma-invoice-repository";

const createGetInvoicesUseCase = (dependencies: {
  invoiceRepositoryDb: InvoiceRepositoryPort;
}) => {
  return {
    execute: async (userId: string): Promise<Invoice[] | null> => {
      const invoices = await dependencies.invoiceRepositoryDb.findAll(userId);

      return invoices;
    },
  };
};

export type GetInvoicesUseCaseType = ReturnType<
  typeof createGetInvoicesUseCase
>;

const getInvoicesUseCase = createGetInvoicesUseCase({
  invoiceRepositoryDb,
});

export default getInvoicesUseCase;
