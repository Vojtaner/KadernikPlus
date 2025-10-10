import { ManagementClient } from "auth0";
import { WithUserId } from "../../../entities/user";
import { CreateImportPayment } from "../../../infrastructure/controllers/payment-controller";
import getUserByIdUseCase, {
  GetUserByIdUseCaseType,
} from "../user/get-user-by-id";
import createPaymentUseCase, {
  CreatePaymentUseCaseType,
} from "./create-payment";
import comgatePaymentApi, {
  ComgatePaymentApiType,
  generate8DigitNumber,
} from "../../../application/services/comgate/comgatePaymentApi";
import { auth0ManagementApi } from "../../../application/services/auth0/auth0ManagementApi";
import { PaymentStatus, Prisma } from "@prisma/client";
import updatePaymentUseCase, {
  UpdatePaymentUseCaseType,
} from "./update-payment";
import { httpError } from "../../../adapters/express/httpError";
import getPaymentByRefIdUseCase, {
  GetPaymentByRefIdUseCaseType,
} from "./get-payment-by-refId";

const createCreateImportPaymentUseCase = (dependencies: {
  createPaymentUseCase: CreatePaymentUseCaseType;
  getUserByIdUseCase: GetUserByIdUseCaseType;
  auth0ManagementApi: ManagementClient;
  updatePaymentUseCase: UpdatePaymentUseCaseType;
  comgatePaymentApi: ComgatePaymentApiType;
  getPaymentByRefIdUseCase: GetPaymentByRefIdUseCaseType;
}) => ({
  execute: async (data: WithUserId<CreateImportPayment>) => {
    const { currency, price, userId } = data;
    const user = await dependencies.getUserByIdUseCase.execute(userId);

    const refId = userId;
    const payment = await dependencies.getPaymentByRefIdUseCase.execute(refId);

    if (!user) {
      throw httpError("Uživatele se nepovedlo najít.", 404);
    }

    const managementApiData = await dependencies.auth0ManagementApi.users.get({
      id: user.id,
    });

    if (!managementApiData) {
      throw httpError("Nepovedlo se načíst Auth0 data.", 500);
    }

    if (payment) {
      if (payment.status === PaymentStatus.PAID) {
        throw httpError(
          "Přístup k importu už máte. Přejděte do svého profilu.",
          500
        );
      }
      if (payment.status === PaymentStatus.PENDING) {
        throw httpError(
          "Platba už je vytvořena, zbývá jen uhradit. Koukněte do emailu.",
          500
        );
      }
    }

    const newImportPayment = await dependencies.createPaymentUseCase.execute({
      amount: new Prisma.Decimal(price),
      initRecurringId: null,
      subscriptionId: null,
      currency: currency || "CZK",
      provider: "COMGATE",
      status: PaymentStatus.PENDING,
      refId: userId,
      transactionId: generate8DigitNumber().toString(),
    });

    const comgatePaymentData =
      await dependencies.comgatePaymentApi.createPayment({
        price: Number(newImportPayment.amount),
        currency: newImportPayment.currency,
        email: user.email,
        initRecurring: false,
        refId: newImportPayment.refId.toString(),
        fullName: user.name,
        label: `Import kontaktů pro česká telefonní čísla`,
        phone: managementApiData.data.phone_number,
      });

    if (comgatePaymentData) {
      const payment = await dependencies.updatePaymentUseCase.execute(
        {
          transactionId: comgatePaymentData.transId,
        },
        newImportPayment.id
      );
    }

    return comgatePaymentData;
  },
});

export type CreateImportPaymentUseCaseType = ReturnType<
  typeof createCreateImportPaymentUseCase
>;

const createImportPaymentUseCase = createCreateImportPaymentUseCase({
  createPaymentUseCase,
  auth0ManagementApi,
  comgatePaymentApi,
  getUserByIdUseCase,
  updatePaymentUseCase,
  getPaymentByRefIdUseCase,
});

export default createImportPaymentUseCase;
