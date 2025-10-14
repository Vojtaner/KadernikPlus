import { Payment, SubscriptionStatus } from "@prisma/client";
import { PaymentRepositoryPort } from "../../ports/payment-repository";
import paymentRepositoryDb from "../../../infrastructure/data/prisma/prisma-payment-repository";
import { SubscriptionRepositoryPort } from "../../../application/ports/subscription-repository";
import subscriptionRepositoryDb from "../../../infrastructure/data/prisma/prisma-subscription-repository";
import { PaymentStatus } from "./create-payment";
import createInvoiceUseCase, {
  CreateInvoiceUseCaseType,
} from "../invoice/create-invoice";
import getUserByIdUseCase, {
  GetUserByIdUseCaseType,
} from "../user/get-user-by-id";
import { InvoiceRepositoryPort } from "../../../application/ports/invoice-repository";
import invoiceRepositoryDb from "../../../infrastructure/data/prisma/prisma-invoice-repository";
import dayjs from "dayjs";

const createPushNotificationPaymentUseCase = (dependencies: {
  paymentRepositoryDb: PaymentRepositoryPort;
  subscriptionRepositoryDb: SubscriptionRepositoryPort;
  createInvoiceUseCase: CreateInvoiceUseCaseType;
  getUserByIdUseCase: GetUserByIdUseCaseType;
  invoiceRepositoryDb: InvoiceRepositoryPort;
}) => ({
  execute: async (data: Partial<Payment>) => {
    const updatedPayment = await dependencies.paymentRepositoryDb.updatePayment(
      {
        transactionId: data.transactionId,
        status: data.status,
        initRecurringId: data.initRecurringId,
        refId: data.refId,
      }
    );

    const now = new Date();
    const plus30DaysDate = new Date(now);
    plus30DaysDate.setDate(now.getDate() + 30);

    if (updatedPayment && updatedPayment.status === PaymentStatus.PAID) {
      if (updatedPayment?.initRecurringId && updatedPayment.subscriptionId) {
        const updatedSubscription =
          await dependencies.subscriptionRepositoryDb.update(
            updatedPayment.subscriptionId,
            {
              status: SubscriptionStatus.ACTIVE,
              startDate: now,
              endDate: plus30DaysDate,
            }
          );
        const newInvoice = await dependencies.createInvoiceUseCase.execute({
          payment: updatedPayment,
          userId: updatedSubscription.userId,
          note: `Faktura za předplatné typu ${
            updatedSubscription.plan
          }, platného do ${dayjs(updatedSubscription.endDate).format(
            "DD/MM/YYYY"
          )}. Předplatné se automaticky obnoví. Uživatel může předplatné zrušit ve svém profilu.`,
        });
        return updatedSubscription;
      } else {
        const newInvoice = await dependencies.createInvoiceUseCase.execute({
          payment: updatedPayment,
          userId: updatedPayment.refId,
          note: "Prémiový přístup k funkci importu kontaktů neomezeně.",
        });
      }
    }
  },
});

export type UpdatePushNotificationPaymentUseCaseType = ReturnType<
  typeof createPushNotificationPaymentUseCase
>;

const updatePushNotificationPaymentUseCase =
  createPushNotificationPaymentUseCase({
    paymentRepositoryDb,
    subscriptionRepositoryDb,
    createInvoiceUseCase,
    getUserByIdUseCase,
    invoiceRepositoryDb,
  });

export default updatePushNotificationPaymentUseCase;
