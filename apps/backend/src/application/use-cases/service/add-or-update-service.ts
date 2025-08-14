import { ServiceRepositoryPort } from "../../ports/service-repository";
import serviceRepositoryDb from "../../../infrastructure/data/prisma/prisma-service-repository";
import { WithUserId } from "@/entities/user";
import { Service } from "@prisma/client";
import logRepositoryDb from "../../../infrastructure/data/prisma/prisma-log-repository";
import { LogRepositoryPort } from "../../../application/ports/log-repository";
import { ServiceCreateOrUpdateData } from "../../../entities/service";
import { TeamMemberRepositoryPort } from "@/application/ports/team-member-repository";
import teamMemberRepositoryDb from "../../../infrastructure/data/prisma/prisma-team-member-repository";

class ServiceAlreadyExistsError extends Error {
  constructor(name: string) {
    super(`Service '${name}' already exists.`);
    this.name = "ServiceAlreadyExistsError";
  }
}

const createAddOrUpdateServiceUseCase = (dependencies: {
  serviceRepositoryDb: ServiceRepositoryPort;
  logRepositoryDb: LogRepositoryPort;
  teamMemberRepositoryDb: TeamMemberRepositoryPort;
}) => {
  return {
    execute: async (
      serviceData: WithUserId<ServiceCreateOrUpdateData>
    ): Promise<Service> => {
      let action = "create";
      let serviceId: string;
      let message = "";

      const newOrUpdatedService =
        await dependencies.serviceRepositoryDb.addOrUpdate(serviceData);

      if (serviceData.id) {
        action = "update";
        serviceId = serviceData.id;
        message = `Upravená služba ${serviceData.serviceName}`;
      } else {
        serviceId = newOrUpdatedService.id;
        message = `Vytvořena služba ${newOrUpdatedService.serviceName}`;
      }

      const teamMember =
        await dependencies.teamMemberRepositoryDb.findUniqueMember(
          serviceData.userId
        );

      if (!teamMember) {
        throw Error("Chybí team id.");
      }

      await dependencies.logRepositoryDb.log({
        userId: serviceData.userId,
        action,
        entityType: "service",
        entityId: serviceId,
        message,
        metadata: { input: serviceData },
        teamId: teamMember?.teamId,
      });

      return newOrUpdatedService;
    },
  };
};

const addOrUpdateServiceUseCase = createAddOrUpdateServiceUseCase({
  serviceRepositoryDb: serviceRepositoryDb,
  logRepositoryDb: logRepositoryDb,
  teamMemberRepositoryDb: teamMemberRepositoryDb,
});

export type AddOrUpdateServiceUseCaseType = ReturnType<
  typeof createAddOrUpdateServiceUseCase
>;

export default addOrUpdateServiceUseCase;
