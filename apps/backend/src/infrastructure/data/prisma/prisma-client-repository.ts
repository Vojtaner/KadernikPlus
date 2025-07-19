import { Client, ClientCreateData } from "@/entities/client";
import { ClientRepositoryPort } from "../../../application/ports/client-repository";
import { PrismaClient } from "@prisma/client";
import prisma from "./prisma";
import mapToDomainClient from "../../../infrastructure/mappers/client-mapper";
import { WithUserId } from "@/entities/user";

const createClientRepositoryDb = (
  prismaRepository: PrismaClient
): ClientRepositoryPort => {
  return {
    findAll: async (userId: string): Promise<Client[]> => {
      const clients = await prismaRepository.client.findMany({
        where: { userId },
      });
      return clients.map((client) => mapToDomainClient(client));
    },
    add: async (clientData: WithUserId<ClientCreateData>): Promise<Client> => {
      const userTeam = await prismaRepository.teamMember.findFirst({
        where: { userId: clientData.userId },
      });

      if (!userTeam) {
        throw new Error("User is not assigned to any team.");
      }

      const newClient = await prismaRepository.client.create({
        data: {
          firstName: clientData.firstName,
          lastName: clientData.lastName,
          phone: clientData.phone,
          note: clientData.note,
          userId: clientData.userId,
          teamId: userTeam.teamId,
        },
      });

      return mapToDomainClient(newClient);
    },
    findById: async (id: string): Promise<Client | null> => {
      const client = await prismaRepository.client.findUnique({
        where: { id },
      });
      return client ? mapToDomainClient(client) : null;
    },
    findByPhone: async (phone: string): Promise<Client | null> => {
      const client = await prismaRepository.client.findUnique({
        where: { phone }, // 'phone' is marked @unique in schema.prisma
      });
      return client ? mapToDomainClient(client) : null;
    },
  };
};

const clientRepositoryDb = createClientRepositoryDb(prisma);

export default clientRepositoryDb;
