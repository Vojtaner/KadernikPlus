import { Service as EntityService } from "@/entities/service";
import { Service } from "@prisma/client";

const mapToDomainService = (prismaServiceItem: Service): EntityService => {
  return {
    id: prismaServiceItem.id,
    serviceName: prismaServiceItem.serviceName,
    basePrice: prismaServiceItem.basePrice.toNumber(),
  };
};

export default mapToDomainService;
