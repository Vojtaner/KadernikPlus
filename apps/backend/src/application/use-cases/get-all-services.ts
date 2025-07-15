import { Service } from "@/entities/service";
import { ServiceRepositoryPort } from "../../application/ports/service-repository";
import serviceRepositoryDb from "../../infrastructure/data/prisma/prisma-service-repository";

const createGetAllServicesUseCase = (dependencies: {
  serviceRepositoryDb: ServiceRepositoryPort;
}) => {
  return {
    execute: async (): Promise<Service[]> => {
      const services = await dependencies.serviceRepositoryDb.getAllServices();
      return services;
    },
  };
};

const getAllServicesUseCase = createGetAllServicesUseCase({
  serviceRepositoryDb,
});

export type GetAllServicesUseCaseType = ReturnType<
  typeof createGetAllServicesUseCase
>;
export default getAllServicesUseCase;
