import { WithUserId } from "@/entities/user";
import { VisitCreateData } from "@/entities/visit";
import { CreatedVisit } from "@/infrastructure/mappers/visit-mapper";
import { Service, Visit } from "@prisma/client";

export type VisitRepositoryPort = {
  add(visitData: WithUserId<VisitCreateData>): Promise<CreatedVisit>;
  findAll: (clientId?: string) => Promise<Visit[]>;
  findById: (id: string) => Promise<Visit | null>;
  delete: (id: string) => Promise<void>;
  update: (visitData: any) => Promise<Visit>;
  findByDate: (filter: {
    date?: Date;
    from?: Date;
    to?: Date;
    userId: string;
  }) => Promise<Omit<Visit, "serviceIds"> & { services: Service[] }[]>;
};
