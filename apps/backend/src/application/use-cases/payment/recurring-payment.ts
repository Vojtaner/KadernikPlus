import { PaymentRepositoryPort } from "../../ports/payment-repository";
import paymentRepositoryDb from "../../../infrastructure/data/prisma/prisma-payment-repository";
import { httpError } from "../../../adapters/express/httpError";
import comgatePaymentApi, {
  ComgatePaymentApiType,
  generate8DigitNumber,
} from "../../../application/services/comgate/comgatePaymentApi";
import { Prisma, SubscriptionStatus } from "@prisma/client";
import { SubscriptionRepositoryPort } from "../../../application/ports/subscription-repository";
import createPaymentUseCase, {
  CreatePaymentUseCaseType,
  PaymentStatus,
} from "./create-payment";
import subscriptionRepositoryDb from "../../../infrastructure/data/prisma/prisma-subscription-repository";
import updatePaymentUseCase, {
  UpdatePaymentUseCaseType,
} from "./update-payment";
import dayjs from "dayjs";
import createInvoiceUseCase, {
  CreateInvoiceUseCaseType,
} from "../invoice/create-invoice";

const createRecurringPaymentUseCase = (dependencies: {
  paymentRepositoryDb: PaymentRepositoryPort;
  comgatePaymentApi: ComgatePaymentApiType;
  subscriptionRepositoryDb: SubscriptionRepositoryPort;
  createPaymentUseCase: CreatePaymentUseCaseType;
  updatePaymentUseCase: UpdatePaymentUseCaseType;
  createInvoiceUseCase: CreateInvoiceUseCaseType;
}) => ({
  execute: async (subscriptionId: string) => {
    const lastPayment =
      await dependencies.paymentRepositoryDb.findBySubscriptionId(
        subscriptionId
      );

    const subscription = await dependencies.subscriptionRepositoryDb.findById(
      subscriptionId
    );

    if (!lastPayment || !subscription) {
      throw httpError(
        "Nebylo možné najít poslední platbu pro dané předplatné nebo samotnou platbu.",
        404
      );
    }

    const newPayment = await dependencies.createPaymentUseCase.execute({
      initRecurringId: "",
      subscriptionId: subscription.id,
      amount: new Prisma.Decimal(lastPayment.amount),
      currency: lastPayment.currency,
      provider: "COMGATE",
      status: PaymentStatus.PENDING,
      refId: generate8DigitNumber(),
      transactionId: generate8DigitNumber().toString(),
    });

    if (!newPayment) {
      throw httpError("Nepodařilo se vytvořit novou platbu.", 500);
    }

    const newComgateRecurringPayment =
      await dependencies.comgatePaymentApi.recurringPayment({
        curr: newPayment.currency,
        price: Number(newPayment.amount),
        label: `Předplatné typu - ${subscription.plan}`,
        refId: String(newPayment.refId),
        transId: lastPayment.transactionId,
      });

    const isSuccessfullyPaid =
      newComgateRecurringPayment.message === "OK" &&
      newComgateRecurringPayment.code === 0;

    if (isSuccessfullyPaid) {
      const updatedPayment = await dependencies.updatePaymentUseCase.execute(
        {
          transactionId: newComgateRecurringPayment.transId,
          status: PaymentStatus.PAID,
        },
        newPayment.id
      );

      const plus30DaysDate = dayjs(subscription.endDate || new Date())
        .add(30, "day")
        .toDate();

      if (!updatedPayment) {
        throw httpError(
          "Nepovedlo se aktualizovat platbu, ale máte zaplaceno.",
          500
        );
      }

      const updatedSubscription =
        await dependencies.subscriptionRepositoryDb.update(
          updatedPayment.subscriptionId,
          {
            status: SubscriptionStatus.ACTIVE,
            endDate: plus30DaysDate,
          }
        );

      const newInvoice = await dependencies.createInvoiceUseCase.execute({
        payment: updatedPayment,
        subscription: updatedSubscription,
      });
    }

    return isSuccessfullyPaid;
  },
});

export type RecurringPaymentUseCaseType = ReturnType<
  typeof createRecurringPaymentUseCase
>;

const recurringPaymentUseCase = createRecurringPaymentUseCase({
  paymentRepositoryDb,
  comgatePaymentApi,
  subscriptionRepositoryDb,
  createPaymentUseCase,
  updatePaymentUseCase,
  createInvoiceUseCase,
});

export default recurringPaymentUseCase;
