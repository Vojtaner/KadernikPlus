// src/infrastructure/data/prisma/prisma-service-repository.ts
import { Service, ServiceCreateData } from "@/entities/service";
import { ServiceRepositoryPort } from "@/application/ports/service-repository";
import { PrismaClient } from "@prisma/client";
import prisma from "./prisma";
import mapToDomainService from "../../../infrastructure/mappers/service-mapper";
import { WithUserId } from "@/entities/user";

const createServiceRepositoryDb = (
  prismaServiceRepository: PrismaClient
): ServiceRepositoryPort => {
  return {
    getAllServices: async (userId: string): Promise<Service[]> => {
      const services = await prismaServiceRepository.service.findMany({
        where: { userId },
      });
      return services.map(mapToDomainService);
    },
    findByName: async (
      serviceName: string,
      userId: string
    ): Promise<Service | null> => {
      const service = await prismaServiceRepository.service.findUnique({
        where: {
          userId_serviceName: {
            userId,
            serviceName,
          },
        },
      });

      return service ? mapToDomainService(service) : null;
    },

    addService: async (
      serviceData: WithUserId<ServiceCreateData>
    ): Promise<Service> => {
      const newService = await prismaServiceRepository.service.create({
        data: {
          serviceName: serviceData.serviceName,
          basePrice: serviceData.basePrice,
          user: {
            connect: {
              id: serviceData.userId,
            },
          },
        },
      });
      return mapToDomainService(newService);
    },
  };
};

const serviceRepositoryDb = createServiceRepositoryDb(prisma);

export default serviceRepositoryDb;
