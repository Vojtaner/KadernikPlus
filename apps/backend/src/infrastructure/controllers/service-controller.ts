import { ServiceCreateOrUpdateData } from "../../entities/service";
import { ControllerFunction } from "@/adapters/express/make-express-callback";
import getAllServicesUseCase, {
  GetAllServicesUseCaseType,
} from "../../application/use-cases/service/get-all-services";
import addOrUpdateServiceUseCase, {
  AddOrUpdateServiceUseCaseType,
} from "../../application/use-cases/service/add-or-update-service";
import { WithUserId } from "@/entities/user";

type AddOrUpdateServiceControllerType = {
  body: ServiceCreateOrUpdateData;
};
type GetAllServicesControllerType = {};

const createServiceController = (dependencies: {
  addOrUpdateServiceUseCase: AddOrUpdateServiceUseCaseType;
  getAllServicesUseCase: GetAllServicesUseCaseType;
}) => {
  const addOrUpdateServiceController: ControllerFunction<
    AddOrUpdateServiceControllerType
  > = async (httpRequest) => {
    const { serviceName, basePrice, teamId, id } = httpRequest.body;
    const userId = httpRequest.userId;

    const serviceData: WithUserId<ServiceCreateOrUpdateData> = {
      serviceName,
      basePrice,
      userId,
      teamId,
      id,
    };

    const newService = await dependencies.addOrUpdateServiceUseCase.execute(
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
    addOrUpdateServiceController,
    getAllServicesController,
  };
};

const serviceController = createServiceController({
  addOrUpdateServiceUseCase,
  getAllServicesUseCase,
});

export default serviceController;
