import { ControllerFunction } from "../../adapters/express/make-express-callback";
import { ComgateUpdatePaymentRequired } from "../../application/services/comgate/comgatePaymentApi";
import { Payment } from "@prisma/client";
import updatePushNotificationPaymentUseCase, {
  UpdatePushNotificationPaymentUseCaseType,
} from "../../application/use-cases/payment/push-notification-payment";
import createImportPaymentUseCase, {
  CreateImportPaymentUseCaseType,
} from "../../application/use-cases/payment/create-import-payment";
import { httpError } from "../../adapters/express/httpError";
import getPaymentByRefIdUseCase, {
  GetPaymentByRefIdUseCaseType,
} from "../../application/use-cases/payment/get-payment-by-refId";

type PaymentControllerType = {
  createPaymentController: ControllerFunction<{
    body: {
      subscriptionId: string;
      amount: number;
      provider: string;
      currency?: string;
    };
  }>;
  createImportPaymentController: ControllerFunction<{
    body: CreateImportPayment;
  }>;
  getPaymentByRefIdController: ControllerFunction<{}>;
  updatePaymentStatusController: ControllerFunction<{
    body: ComgateUpdatePaymentRequired;
  }>;
};

export const createPaymentController = (dependencies: {
  createImportPaymentUseCase: CreateImportPaymentUseCaseType;
  updatePushNotificationPaymentUseCase: UpdatePushNotificationPaymentUseCaseType;
  getPaymentByRefIdUseCase: GetPaymentByRefIdUseCaseType;
}) => {
  const updatePushNotificationPaymentController: ControllerFunction<{
    body: ComgateUpdatePaymentRequired;
  }> = async (httpRequest) => {
    const data = httpRequest.body;

    const paymentData: Partial<Payment> = {
      refId: data.refId,
      transactionId: data.transId,
      status: data.status,
    };

    try {
      const payment =
        await dependencies.updatePushNotificationPaymentUseCase.execute(
          paymentData
        );
      return { statusCode: 200, message: "OK" };
    } catch (error) {
      throw new Error("Platbu se nepovedlo aktualizovat.");
    }
  };
  const createImportPaymentController: PaymentControllerType["createImportPaymentController"] =
    async (httpRequests) => {
      const userId = httpRequests.userId;
      const body = httpRequests.body;

      const newImportPayment =
        await dependencies.createImportPaymentUseCase.execute({
          ...body,
          userId,
        });

      if (!newImportPayment) {
        throw httpError("Platba nezaložena.", 400);
      }

      return { statusCode: 201, body: newImportPayment };
    };
  const getPaymentByRefIdController: PaymentControllerType["getPaymentByRefIdController"] =
    async (httpRequests) => {
      const userId = httpRequests.userId;

      const payment = await dependencies.getPaymentByRefIdUseCase.execute(
        userId
      );

      if (!payment) {
        return { statusCode: 200, body: null };
      }

      return { statusCode: 200, body: payment };
    };
  return {
    updatePushNotificationPaymentController,
    createImportPaymentController,
    getPaymentByRefIdController,
  };
};

const paymentController = createPaymentController({
  createImportPaymentUseCase,
  updatePushNotificationPaymentUseCase,
  getPaymentByRefIdUseCase,
});

export default paymentController;

export type CreateImportPayment = {
  currency: "CZK";
  price: number;
};

export type ImportStatus = "ACTIVE" | "CANCELLED" | "PENDING";
