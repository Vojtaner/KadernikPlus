import { Service, ServiceCreateData } from "@/entities/service";
import { WithUserId } from "@/entities/user";

export type ServiceRepositoryPort = {
  getAllServices: () => Promise<Service[]>;
  addService: (serviceData: WithUserId<ServiceCreateData>) => Promise<Service>;
  findByName: (serviceName: string, userId: string) => Promise<Service | null>;
};
