import { Prisma } from "@prisma/client";

export type StockAllowanceWithProcedureAndItem =
  Prisma.StockAllowanceGetPayload<{
    include: {
      procedure: {
        select: { visitId: true; visit: { select: { clientId: true } } };
      };
      stockItem: {
        select: { unit: true };
      };
      user: { select: { name: true } };
    };
  }>;
