import { Visit as VisitEntity } from "@/entities/visit";
import { Client, Prisma, Service } from "@prisma/client";

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

export type VisitWithServicesWithProceduresWithStockAllowances =
  Prisma.VisitGetPayload<{
    include: {
      client: true;
      procedures: {
        include: { stockAllowances: { include: { stockItem: true } } };
      };
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
