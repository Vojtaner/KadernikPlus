import { Visit as VisitEntity } from "@/entities/visit";
import { Client, Prisma, Service, Visit } from "@prisma/client";

export type VisitWithServices = Prisma.VisitGetPayload<{
  include: {
    client: true;
    visitServices: {
      include: {
        service: true;
      };
    };
  };
}>;

export type CreatedVisit = Prisma.VisitGetPayload<{
  include: {
    visitServices: true;
  };
}>;

const mapToDomainVisit = (
  prismaVisit: VisitWithServices
): Omit<VisitEntity, "serviceIds" | "clientId"> & {
  client: Client;
  services: Service[];
} => {
  return {
    id: prismaVisit.id,
    client: prismaVisit.client,
    date: prismaVisit.date,
    services: prismaVisit.visitServices.map(
      (visitService) => visitService.service
    ),
    note: prismaVisit.note,
  };
};

export default mapToDomainVisit;
