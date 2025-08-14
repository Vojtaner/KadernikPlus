import { Decimal } from "@prisma/client/runtime/library";

export type EntityService = {
  id: string;
  serviceName: string;
  basePrice: number;
  userId?: string;
  teamId: string | null;
};

export type Service = {
  id: string;
  serviceName: string;
  basePrice: Decimal;
  userId?: string;
  teamId: string | null;
};

const mapToDomainService = (prismaServiceItem: Service): EntityService => {
  return {
    id: prismaServiceItem.id,
    serviceName: prismaServiceItem.serviceName,
    basePrice: prismaServiceItem.basePrice.toNumber(),
    teamId: prismaServiceItem.teamId,
  };
};

export default mapToDomainService;
