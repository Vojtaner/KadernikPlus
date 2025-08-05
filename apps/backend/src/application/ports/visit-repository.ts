import { WithUserId } from "@/entities/user";
import { VisitCreateData } from "@/entities/visit";
import {
  CreatedVisit,
  VisitWithServices,
  VisitWithServicesWithProceduresWithStockAllowances,
} from "../../infrastructure/mappers/visit-mapper";
import { Service, Visit } from "@prisma/client";

export type VisitRepositoryPort = {
  add(visitData: WithUserId<VisitCreateData>): Promise<CreatedVisit>;
  findAll: (clientId?: string) => Promise<VisitWithServices[]>;
  findById: (
    id: string
  ) => Promise<VisitWithServicesWithProceduresWithStockAllowances | null>;
  delete: (id: string) => Promise<void>;
  update: (visitData: any) => Promise<Visit>;
  findByDate: (filter: {
    date?: Date;
    from?: Date;
    to?: Date;
    userId: string;
  }) => Promise<VisitWithServices[]>;
  updateStatus: (visitId: string, status: boolean) => Promise<Visit>;
};
