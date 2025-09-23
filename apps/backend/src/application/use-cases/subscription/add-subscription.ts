import { Prisma } from ".prisma/client";
import {
  SubscriptionCreateData,
  SubscriptionRepositoryPort,
} from "../../ports/subscription-repository";
import subscriptionRepositoryDb from "../../../infrastructure/data/prisma/prisma-subscription-repository";
import createPaymentUseCase, {
  CreatePaymentUseCaseType,
} from "../payment/create-payment";
import comgatePaymentApi, {
  ComgateCreatePaymentReturnType,
  ComgatePaymentApiType,
  generate8DigitNumber,
} from "../../services/comgate/comgatePaymentApi";
import { UserRepositoryPort } from "../../../application/ports/user-repository";
import userRepositoryDb from "../../../infrastructure/data/prisma/prisma-user-repository";
import { ManagementClient } from "auth0";
import { auth0ManagementApi } from "../../../application/services/auth0/auth0ManagementApi";
import updatePaymentUseCase, {
  UpdatePaymentUseCaseType,
} from "../payment/update-payment";
import { WithUserId } from "@/entities/user";
import { httpError } from "../../../adapters/express/httpError";

export type PaymentStatus = "PENDING" | "AUTHORIZED" | "PAID" | "CANCELLED";

const createAddSubscriptionUseCase = (dependencies: {
  subscriptionRepositoryDb: SubscriptionRepositoryPort;
  userRepositoryDb: UserRepositoryPort;
  createPaymentUseCase: CreatePaymentUseCaseType;
  updatePaymentUseCase: UpdatePaymentUseCaseType;
  comgatePaymentApi: ComgatePaymentApiType;
  auth0ManagementApi: ManagementClient;
}) => ({
  execute: async (
    data: WithUserId<SubscriptionCreateData>
  ): Promise<ComgateCreatePaymentReturnType> => {
    const existingSubscription =
      await dependencies.subscriptionRepositoryDb.findByUserId(data.userId);

    if (existingSubscription && existingSubscription.status === "ACTIVE") {
      throw new Error("Uživatel už má platné členství.");
    }

    if (existingSubscription && existingSubscription.status === "PENDING") {
      throw httpError("Uživatel už má nezaplacené členství.", 403);
    }

    const user = await dependencies.userRepositoryDb.findById(data.userId);

    if (!user) {
      throw new Error("Uživatele se nepovedlo najít.");
    }

    const managementApiData = await dependencies.auth0ManagementApi.users.get({
      id: user.id,
    });

    if (!managementApiData) {
      throw new Error("Nepovedlo se načíst Auth0 data.");
    }

    const newSubscription = await dependencies.subscriptionRepositoryDb.add({
      ...data,
    });

    const newPayment = await dependencies.createPaymentUseCase.execute({
      initRecurringId: "",
      subscriptionId: newSubscription.id,
      amount: new Prisma.Decimal(data.price),
      currency: data.currency || "CZK",
      provider: "COMGATE",
      status: data.status,
      refId: generate8DigitNumber(),
      transactionId: generate8DigitNumber().toString(),
    });

    const comgatePaymentData =
      await dependencies.comgatePaymentApi.createPayment({
        price: Number(newPayment.amount),
        currency: newPayment.currency,
        email: user.email,
        refId: newPayment.refId.toString(),
        fullName: user.name,
        label: `Předplatné typu - ${newSubscription.plan}`,
        phone: managementApiData.data.phone_number,
      });

    if (comgatePaymentData) {
      const payment = await dependencies.updatePaymentUseCase.execute(
        {
          transactionId: comgatePaymentData.transId,
        },
        newPayment.id
      );
    }

    return comgatePaymentData;
  },
});

export type AddSubscriptionUseCaseType = ReturnType<
  typeof createAddSubscriptionUseCase
>;

const addSubscriptionUseCase = createAddSubscriptionUseCase({
  subscriptionRepositoryDb,
  userRepositoryDb,
  createPaymentUseCase,
  comgatePaymentApi,
  auth0ManagementApi,
  updatePaymentUseCase,
});

export default addSubscriptionUseCase;
