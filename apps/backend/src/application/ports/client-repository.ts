import { Client, ClientCreateData } from "@/entities/client";
import { WithUserId } from "@/entities/user";

export type ClientRepositoryPort = {
  add: (clientData: WithUserId<ClientCreateData>) => Promise<Client>;
  findById: (id: string) => Promise<Client | null>;
  findAll: (userId: string) => Promise<Client[]>;
  findByPhone: (phone: string) => Promise<Client | null>;
};
