import { Procedure } from ".prisma/client";
import { Decimal } from "@prisma/client/runtime/library";

export type ProcedureCreateData = {
  id?: string;
  userId: string;
  description?: string;
  visitId: string;
  stockAllowances?: {
    id: string;
    stockItemId: string;
    stockAllowanceId?: string;
    quantity: number;
    userId: string;
  }[];
};

export type ProcedureRepositoryPort = {
  findByVisitId: (visitId: string) => Promise<Procedure[]>;
  addOrUpdate: (data: ProcedureCreateData) => Promise<Procedure>;
  delete: (procedureId: string) => Promise<string>;
};

export type StockAllowanceProcedureType = {
  id: string;
  createdAt: Date;
  userId: string;
  teamId: string;
  stockItemId: string;
  avgUnitPrice: Decimal;
  stockItemName: string | null;
  procedureId: string;
  quantity: Decimal;
};
