import { ControllerFunction } from "@/adapters/express/make-express-callback";
import createPaymentUseCase, {
  CreatePaymentUseCaseType,
} from "../../application/use-cases/payment/create-payment";
import updatePaymentStatusUseCase, {
  UpdatePaymentUseCaseType,
} from "../../application/use-cases/payment/update-payment";
import { ComgateUpdatePaymentRequired } from "@/application/services/comgatePaymentApi";
import { Payment } from "@prisma/client";

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
  updatePaymentStatusUseCase: UpdatePaymentUseCaseType;
}) => {
  const updatePaymentStatusController: ControllerFunction<{
    body: ComgateUpdatePaymentRequired;
  }> = async (httpRequest) => {
    const data = httpRequest.body;

    const paymentData: Partial<Payment> = {
      refId: Number(data.refId),
      transactionId: data.transId,
      status: data.status,
    };
    console.log({ http: httpRequest.body });
    console.log({ paymentData });
    try {
      const payment = await dependencies.updatePaymentStatusUseCase.execute(
        paymentData
      );
      return { statusCode: 200, message: "OK" };
    } catch (error) {
      throw new Error("Platbu se nepovedlo aktualizovat.");
    }
  };
  return {
    createPaymentController,
    updatePaymentStatusController,
  };
};

const paymentController = createPaymentController({
  createPaymentUseCase,
  updatePaymentStatusUseCase,
});

export default paymentController;
