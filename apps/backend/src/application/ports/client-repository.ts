import { ClientOrUpdateCreateData } from "@/entities/client";
import { WithUserId } from "@/entities/user";
import {
  ClientWithVisits,
  ClientWithVisitsAndServices,
} from "@/infrastructure/mappers/client-mapper";
import { Client } from "@prisma/client";

export type ClientRepositoryPort = {
  addOrUpdate: (
    clientData: WithUserId<ClientOrUpdateCreateData>
  ) => Promise<Client>;
  findById: (id: string, userId: string) => Promise<ClientWithVisits | null>;
  findAll: (userId: string) => Promise<Client[]>;
  findByPhone: (phone: string) => Promise<Client | null>;
  search: (
    teamId: string,
    query: string,
    userId: string
  ) => Promise<ClientWithVisitsAndServices[]>;
};
