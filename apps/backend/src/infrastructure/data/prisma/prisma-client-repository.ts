import { Client, ClientCreateData } from "@/entities/client";
import { ClientRepositoryPort } from "../../../application/ports/client-repository";
import { PrismaClient } from "@prisma/client";
import prisma from "./prisma";
import mapToDomainClient from "../../../infrastructure/mappers/client-mapper";
import { WithUserId } from "@/entities/user";

const createClientRepositoryDb = (
  prismaVisitRepository: PrismaClient
): ClientRepositoryPort => {
  return {
    findAll: async (): Promise<Client[]> => {
      const clients = await prismaVisitRepository.client.findMany();
      return clients.map((client) => mapToDomainClient(client));
    },
    add: async (clientData: WithUserId<ClientCreateData>): Promise<Client> => {
      const newClient = await prismaVisitRepository.client.create({
        data: {
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          phone: clientData.phone,
          note: clientData.note,
          userId: clientData.userId,
        },
      });

      return mapToDomainClient(newClient);
    },
    findById: async (id: string): Promise<Client | null> => {
      const client = await prismaVisitRepository.client.findUnique({
        where: { id },
      });
      return client ? mapToDomainClient(client) : null;
    },
    findByPhone: async (phone: string): Promise<Client | null> => {
      const client = await prismaVisitRepository.client.findUnique({
        where: { phone }, // 'phone' is marked @unique in schema.prisma
      });
      return client ? mapToDomainClient(client) : null;
    },
  };
};

const clientRepositoryDb = createClientRepositoryDb(prisma);

export default clientRepositoryDb;
