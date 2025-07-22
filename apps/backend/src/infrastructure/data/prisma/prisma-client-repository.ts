import { ClientCreateData } from "@/entities/client";
import { ClientRepositoryPort } from "../../../application/ports/client-repository";
import { Client, PrismaClient } from "@prisma/client";
import prisma from "./prisma";
import { ClientWithVisits } from "../../../infrastructure/mappers/client-mapper";
import { WithUserId } from "@/entities/user";

const createClientRepositoryDb = (
  prismaRepository: PrismaClient
): ClientRepositoryPort => {
  return {
    findAll: async (userId: string): Promise<Client[]> => {
      const clients = await prismaRepository.client.findMany({
        where: { userId },
      });
      return clients;
    },
    search: async (teamId: string, query: string): Promise<Client[]> => {
      const clients = await prismaRepository.client.findMany({
        where: {
          teamId,
          firstName: {
            search: query,
          },
          lastName: {
            search: query,
          },
          phone: {
            search: query,
          },
        },
        include: { visits: true },
      });

      return clients;
    },
    add: async (clientData: WithUserId<ClientCreateData>): Promise<Client> => {
      const { id: clientId } = clientData;

      if (clientId) {
        const existingClient = await prismaRepository.client.findFirst({
          where: {
            id: clientId,
          },
        });

        if (existingClient) {
          const { userId, id, teamId, ...updateFields } = clientData;

          const updatedClient = await prismaRepository.client.update({
            where: { id: clientId },
            data: updateFields,
          });

          return updatedClient;
        }
      }

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

      return newClient;
    },
    findById: async (id: string): Promise<ClientWithVisits | null> => {
      const clientWithVisits = await prismaRepository.client.findUnique({
        where: { id },
        include: { visits: true },
      });
      return clientWithVisits;
    },
    findByPhone: async (phone: string): Promise<Client | null> => {
      const client = await prismaRepository.client.findUnique({
        where: { phone },
      });
      return client;
    },
  };
};

const clientRepositoryDb = createClientRepositoryDb(prisma);

export default clientRepositoryDb;
