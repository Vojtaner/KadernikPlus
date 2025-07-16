import { ServiceCreateData } from "@/entities/service";
import { ControllerFunction } from "@/adapters/express/make-express-callback";
import getAllServicesUseCase, {
  GetAllServicesUseCaseType,
} from "../../application/use-cases/get-all-services";
import addServiceUseCase, {
  AddServiceUseCaseType,
} from "../../application/use-cases/add-service";
import { WithUserId } from "@/entities/user";

type AddServiceControllerType = {
  body: ServiceCreateData;
};
type GetAllServicesControllerType = {};

const createServiceController = (dependencies: {
  addServiceUseCase: AddServiceUseCaseType;
  getAllServicesUseCase: GetAllServicesUseCaseType;
}) => {
  const addServiceController: ControllerFunction<
    AddServiceControllerType
  > = async (httpRequest) => {
    const { serviceName, basePrice } = httpRequest.body;
    const userId = httpRequest.userId;

    const serviceData: WithUserId<ServiceCreateData> = {
      serviceName,
      basePrice: Number(basePrice),
      userId,
    };

    const newService = await dependencies.addServiceUseCase.execute(
      serviceData
    );

    return {
      statusCode: 201,
      body: newService,
    };
  };

  const getAllServicesController: ControllerFunction<
    GetAllServicesControllerType
  > = async (httpRequest) => {
    const userId = httpRequest.userId;

    const services = await dependencies.getAllServicesUseCase.execute(userId);

    return {
      statusCode: 200,
      body: services,
    };
  };

  return {
    addServiceController,
    getAllServicesController,
  };
};

const serviceController = createServiceController({
  addServiceUseCase,
  getAllServicesUseCase,
});

export default serviceController;
