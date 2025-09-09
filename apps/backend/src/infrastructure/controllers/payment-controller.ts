import { ControllerFunction } from "@/adapters/express/make-express-callback";
import createPaymentUseCase, {
  CreatePaymentUseCaseType,
} from "../../application/use-cases/payment/create-payment";
import { ComgateUpdatePaymentRequired } from "../../application/services/comgate/comgatePaymentApi";
import { Payment } from "@prisma/client";
import updatePushNotificationPaymentUseCase, {
  UpdatePushNotificationPaymentUseCaseType,
} from "../../application/use-cases/payment/push-notification-payment";

type PaymentControllerType = {
  createPaymentController: ControllerFunction<{
    body: {
      subscriptionId: string;
      amount: number;
      provider: string;
      currency?: string;
    };
  }>;
  updatePaymentStatusController: ControllerFunction<{
    body: ComgateUpdatePaymentRequired;
  }>;
};

export const createPaymentController = (dependencies: {
  createPaymentUseCase: CreatePaymentUseCaseType;
  updatePushNotificationPaymentUseCase: UpdatePushNotificationPaymentUseCaseType;
}) => {
  const updatePushNotificationPaymentController: ControllerFunction<{
    body: ComgateUpdatePaymentRequired;
  }> = async (httpRequest) => {
    const data = httpRequest.body;

    const paymentData: Partial<Payment> = {
      refId: Number(data.refId),
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
  return {
    createPaymentController,
    updatePushNotificationPaymentController,
  };
};

const paymentController = createPaymentController({
  createPaymentUseCase,
  updatePushNotificationPaymentUseCase,
});

export default paymentController;
