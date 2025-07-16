import { Service } from "@/entities/service";
import { ServiceRepositoryPort } from "../../ports/service-repository";
import serviceRepositoryDb from "../../../infrastructure/data/prisma/prisma-service-repository";

const createGetAllServicesUseCase = (dependencies: {
  serviceRepositoryDb: ServiceRepositoryPort;
}) => {
  return {
    execute: async (userId: string): Promise<Service[]> => {
      const services = await dependencies.serviceRepositoryDb.getAllServices(
        userId
      );
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
