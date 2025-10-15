import { ClientOrUpdateCreateData } from "@/entities/client";
import { WithUserId } from "@/entities/user";
import {
  ClientWithVisits,
  ClientWithVisitsAndServices,
} from "@/infrastructure/mappers/client-mapper";
import { Client } from "@prisma/client";
import { Contact } from "../use-cases/clients/import-clients";

export type ClientRepositoryPort = {
  addOrUpdate: (
    clientData: WithUserId<ClientOrUpdateCreateData>
  ) => Promise<Client>;
  importAll: (
    userId: string,
    contacts: Contact[]
  ) => Promise<
    { created: never[]; skipped: number } | { created: number; skipped: number }
  >;
  findById: (id: string, userId: string) => Promise<ClientWithVisits | null>;
  deleteById: (id: string) => Promise<Client>;
  findAll: (userId: string) => Promise<Client[]>;
  search: (
    idList: string[],
    userId: string
  ) => Promise<ClientWithVisitsAndServices[]>;
};
