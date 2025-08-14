import { ServiceCreateOrUpdateData } from "@/entities/service";
import { WithUserId } from "@/entities/user";
import { Service } from "@prisma/client";

export type ServiceRepositoryPort = {
  getAllServices: (userId: string) => Promise<Service[]>;
  addOrUpdate: (
    serviceData: WithUserId<ServiceCreateOrUpdateData>
  ) => Promise<Service>;
  findByName: (serviceName: string, userId: string) => Promise<Service | null>;
};
