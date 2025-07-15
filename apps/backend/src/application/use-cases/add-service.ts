import { Service, ServiceCreateData } from "@/entities/service";
import { ServiceRepositoryPort } from "../../application/ports/service-repository";
import serviceRepositoryDb from "../../infrastructure/data/prisma/prisma-service-repository";
import { WithUserId } from "@/entities/user";

class ServiceAlreadyExistsError extends Error {
  constructor(serviceName: string) {
    super(`Service with name '${serviceName}' already exists.`);
    this.name = "ServiceAlreadyExistsError";
  }
}

const createAddServiceUseCase = (dependencies: {
  serviceRepositoryDb: ServiceRepositoryPort;
}) => {
  return {
    execute: async (
      serviceData: WithUserId<ServiceCreateData>
    ): Promise<Service> => {
      if (serviceData.serviceName) {
        const existingService =
          await dependencies.serviceRepositoryDb.findByName(
            serviceData.serviceName,
            serviceData.userId
          );

        if (existingService) {
          throw new ServiceAlreadyExistsError(serviceData.serviceName);
        }
      }

      const newService = await dependencies.serviceRepositoryDb.addService(
        serviceData
      );

      return newService;
    },
  };
};

const addServiceUseCase = createAddServiceUseCase({ serviceRepositoryDb });

export type AddServiceUseCaseType = ReturnType<typeof createAddServiceUseCase>;
export default addServiceUseCase;
