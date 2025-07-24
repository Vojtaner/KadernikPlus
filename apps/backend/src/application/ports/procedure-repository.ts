import { Procedure } from ".prisma/client";

export type ProcedureCreateData = {
  id?: string;
  userId: string;
  description?: string;
  visitId: string;
  stockAllowances?: {
    stockItemId: string;
    stockAllowanceId?: string;
    quantity: number;
    userId: string;
  }[];
};

export type ProcedureRepositoryPort = {
  findByVisitId: (visitId: string) => Promise<Procedure[]>;
  addOrUpdate: (data: ProcedureCreateData) => Promise<Procedure>;
};
