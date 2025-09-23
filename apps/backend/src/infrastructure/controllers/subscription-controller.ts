import { ControllerFunction } from "@/adapters/express/make-express-callback";
import addSubscriptionUseCase, {
  AddSubscriptionUseCaseType,
} from "../../application/use-cases/subscription/add-subscription";
import cancelSubscriptionUseCase, {
  CancelSubscriptionUseCaseType,
} from "../../application/use-cases/subscription/cancel-subscription";
import { SubscriptionCreateData } from "../../application/ports/subscription-repository";
import getSubscriptionUseCase, {
  GetSubscriptionUseCaseType,
} from "../../application/use-cases/subscription/get-subscription-by-user-id";
import extendSubscriptionUseCase, {
  ExtendSubscriptionUseCaseType,
} from "../../application/use-cases/subscription/extend-subscription";

type SubscriptionControllerType = {
  addSubscriptionController: ControllerFunction<{
    body: SubscriptionCreateData;
  }>;
  cancelSubscriptionController: ControllerFunction<{
    params: { subscriptionId: string };
  }>;
  getActiveSubscriptionController: ControllerFunction<{
    params: { userId: string };
  }>;
  extendSubscriptionController: ControllerFunction<{
    params: { subscrioptionId: string };
  }>;
};

const createSubscriptionController = (dependencies: {
  addSubscriptionUseCase: AddSubscriptionUseCaseType;
  cancelSubscriptionUseCase: CancelSubscriptionUseCaseType;
  getSubscriptionUseCase: GetSubscriptionUseCaseType;
  extendSubscriptionUseCase: ExtendSubscriptionUseCaseType;
}) => {
  const addSubscriptionController: ControllerFunction<
    SubscriptionControllerType["addSubscriptionController"]
  > = async (httpRequest) => {
    try {
      const paymentUrl = await dependencies.addSubscriptionUseCase.execute({
        ...httpRequest.body,
        userId: httpRequest.userId,
      });

      return { statusCode: 201, body: paymentUrl };
    } catch (error: any) {
      return { statusCode: 400, body: { error: error.message } };
    }
  };

  const extendSubscriptionController: ControllerFunction<
    SubscriptionControllerType["extendSubscriptionController"]
  > = async (httpRequest) => {
    const { subscriptionId } = httpRequest.params;

    const sub = await dependencies.extendSubscriptionUseCase.execute(
      subscriptionId
    );

    console.log({ sub });
    return { statusCode: 200, body: sub };
  };

  const cancelSubscriptionController: ControllerFunction<
    SubscriptionControllerType["cancelSubscriptionController"]
  > = async (httpRequest) => {
    const { subscriptionId } = httpRequest.params;
    const subscription = await dependencies.cancelSubscriptionUseCase.execute(
      subscriptionId
    );
    return { statusCode: 200, body: !!subscription };
  };

  const getSubscriptionController: ControllerFunction<
    SubscriptionControllerType["getActiveSubscriptionController"]
  > = async (httpRequest) => {
    const userId = httpRequest.userId;
    const sub = await dependencies.getSubscriptionUseCase.execute(userId);

    return { statusCode: 200, body: sub };
  };

  return {
    addSubscriptionController,
    cancelSubscriptionController,
    getSubscriptionController,
    extendSubscriptionController,
  };
};

const subscriptionController = createSubscriptionController({
  addSubscriptionUseCase,
  cancelSubscriptionUseCase,
  getSubscriptionUseCase,
  extendSubscriptionUseCase,
});

export default subscriptionController;
