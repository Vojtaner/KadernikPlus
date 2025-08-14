import { ServiceCreateOrUpdateData } from "../../../entities/service";
import { ServiceRepositoryPort } from "../../../application/ports/service-repository";
import { PrismaClient, Service } from "@prisma/client";
import prisma from "./prisma";
import mapToDomainService from "../../../infrastructure/mappers/service-mapper";
import { WithUserId } from "../../../entities/user";
import teamMemberRepositoryDb from "./prisma-team-member-repository";

const createServiceRepositoryDb = (
  prismaServiceRepository: PrismaClient
): ServiceRepositoryPort => {
  return {
    getAllServices: async (userId: string): Promise<Service[]> => {
      const services = await prismaServiceRepository.service.findMany({
        where: { userId },
      });

      return services;
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

      return service ?? null;
    },
    addOrUpdate: async (
      serviceData: WithUserId<ServiceCreateOrUpdateData>
    ): Promise<Service> => {
      const { id: serviceId, userId } = serviceData;
      console.log({ serviceData });
      if (serviceId) {
        const existingService = await prismaServiceRepository.service.findFirst(
          {
            where: { id: serviceId },
          }
        );

        if (existingService) {
          const { userId, id, ...updateFields } = serviceData;

          const updatedService = await prismaServiceRepository.service.update({
            where: { id: serviceId },
            data: { ...updateFields },
          });

          return updatedService;
        }
      }

      const teamMember = await teamMemberRepositoryDb.findUniqueMember(userId);

      if (!teamMember) {
        throw Error("Chybí teamId nelze upravit službu.");
      }

      if (!serviceData.serviceName) {
        throw new Error("Zadejte název služby.");
      }

      const newService = await prismaServiceRepository.service.create({
        data: {
          serviceName: serviceData.serviceName,
          basePrice: serviceData.basePrice,
          user: { connect: { id: serviceData.userId } },
        },
      });

      return newService;
    },
  };
};

const serviceRepositoryDb = createServiceRepositoryDb(prisma);

export default serviceRepositoryDb;
