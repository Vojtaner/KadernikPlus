import { Visit as VisitEntity } from "@/entities/visit";
import { Visit } from "@prisma/client";

const mapToDomainVisit = (prismaVisit: Visit): VisitEntity => {
  return {
    id: prismaVisit.id,
    clientId: prismaVisit.clientId,
    date: prismaVisit.date,
    serviceIds: [],
    note: prismaVisit.note,
    // createdAt and updatedAt are typically not part of core domain entity for simple CRUD
  };
};

export default mapToDomainVisit;
