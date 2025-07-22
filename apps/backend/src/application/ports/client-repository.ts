import { ClientCreateData } from "@/entities/client";
import { WithUserId } from "@/entities/user";
import { Client } from "@prisma/client";

export type ClientRepositoryPort = {
  add: (clientData: WithUserId<ClientCreateData>) => Promise<Client>;
  findById: (id: string) => Promise<Client | null>;
  findAll: (userId: string) => Promise<Client[]>;
  findByPhone: (phone: string) => Promise<Client | null>;
  search: (teamId: string, query: string) => Promise<Client[]>;
};
