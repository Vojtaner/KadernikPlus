import { InvoiceRepositoryPort } from "../../ports/invoice-repository";
import invoiceRepositoryDb from "../../../infrastructure/data/prisma/prisma-invoice-repository";
import { InvoiceStatus, Payment, Prisma, Subscription } from ".prisma/client";
import dayjs from "dayjs";
import getUserByIdUseCase, {
  GetUserByIdUseCaseType,
} from "../user/get-user-by-id";

export const createCreateInvoiceUseCase = (dependencies: {
  invoiceRepositoryDb: InvoiceRepositoryPort;
  getUserByIdUseCase: GetUserByIdUseCaseType;
}) => ({
  execute: async (data: { payment: Payment; userId: string; note: string }) => {
    const { payment, userId, note } = data;

    const user = await dependencies.getUserByIdUseCase.execute(userId);

    const year = dayjs().year();
    const lastInvoice = await dependencies.invoiceRepositoryDb.findLastByYear(
      year
    );
    const nextSequence = lastInvoice ? lastInvoice.sequence + 1 : 1;
    const invoiceNumber = `INV-${year}-${String(nextSequence).padStart(
      3,
      "0"
    )}`;

    await dependencies.invoiceRepositoryDb.create({
      invoiceNumber,
      sequence: nextSequence,
      year,
      customerName: user.name,
      customerEmail: user.email,
      amount: new Prisma.Decimal(payment.amount),
      currency: payment.currency,
      status: InvoiceStatus.PAID,
      issuedAt: new Date(),
      paymentId: payment.id,
      notes: note,
    });
  },
});

export type CreateInvoiceUseCaseType = ReturnType<
  typeof createCreateInvoiceUseCase
>;

const createInvoiceUseCase = createCreateInvoiceUseCase({
  invoiceRepositoryDb,
  getUserByIdUseCase,
});

export default createInvoiceUseCase;
