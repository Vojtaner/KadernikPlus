import { WithUserId } from "@/entities/user";
import { Visit, VisitCreateData } from "@/entities/visit";

export type VisitRepositoryPort = {
  add(visitData: WithUserId<VisitCreateData>): Promise<Visit>;
  findAll: (clientId?: string) => Promise<Visit[]>;
  findById: (id: string) => Promise<Visit | null>;
};
