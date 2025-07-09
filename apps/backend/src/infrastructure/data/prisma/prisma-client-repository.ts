import { Client, ClientCreateData } from "@/entities/client";
import {
  ClientRepository,
  ClientRepositoryPort,
} from "@/application/ports/client-repository";
import { PrismaClient } from "@prisma/client";
import prisma from "./prisma";
import mapToDomainClient from "../../../infrastructure/mappers/client-mapper";

/**
 * Prisma-based implementation of the ClientRepository interface.
 * This class acts as an adapter, translating generic ClientRepository operations
 * into specific Prisma Client operations for the 'Client' model.
 */
// export class PrismaClientRepository implements ClientRepository {
//   private prisma: PrismaClient;

//   constructor(prismaClient: PrismaClient) {
//     this.prisma = prismaClient;
//   }

//   /**
//    * Inserts a new client into the database using Prisma.
//    * Maps Prisma's Client model back to the domain Client entity.
//    */
//   async add(clientData: ClientCreateData): Promise<Client> {
//     const newClient = await this.prisma.client.create({
//       data: {
//         name: clientData.name,
//         phone: clientData.phone,
//         email: clientData.email,
//         note: clientData.note,
//         birthDate: clientData.birthDate,
//       },
//     });
//     // Map Prisma model to domain entity
//     return this.toDomainClient(newClient);
//   }

//   /**
//    * Finds a client by their unique ID using Prisma.
//    * Maps Prisma's Client model back to the domain Client entity.
//    */
//   async findById(id: string): Promise<Client | null> {
//     const client = await this.prisma.client.findUnique({
//       where: { id },
//     });
//     return client ? this.toDomainClient(client) : null;
//   }

//   /**
//    * Finds a client by their email using Prisma.
//    * Maps Prisma's Client model back to the domain Client entity.
//    */
//   async findByEmail(email: string): Promise<Client | null> {
//     const client = await this.prisma.client.findUnique({
//       where: { email }, // 'email' is marked @unique in schema.prisma
//     });
//     return client ? this.toDomainClient(client) : null;
//   }

//   /**
//    * Retrieves all clients from the database using Prisma.
//    * Maps Prisma's Client models back to domain Client entities.
//    */
//   async findAll(): Promise<Client[]> {
//     const clients = await this.prisma.client.findMany();
//     return clients.map(this.toDomainClient);
//   }

//   /**
//    * Helper method to map a Prisma Client object to a domain Client entity.
//    * Ensures the domain layer only deals with its own defined types.
//    */
//   private toDomainClient(prismaClient: {
//     id: string;
//     name: string;
//     phone: string | null;
//     email: string | null;
//     note: string | null;
//     birthDate: Date | null;
//   }): Client {
//     return {
//       id: prismaClient.id,
//       name: prismaClient.name,
//       phone: prismaClient.phone,
//       email: prismaClient.email,
//       note: prismaClient.note,
//       birthDate: prismaClient.birthDate,
//     };
//   }
// }

const createClientRepositoryDb = (
  prismaVisitRepository: PrismaClient
): ClientRepositoryPort => {
  return {
    findAll: async (): Promise<Client[]> => {
      const clients = await prismaVisitRepository.client.findMany();
      return clients.map((client) => mapToDomainClient(client));
    },
    add: async (clientData: ClientCreateData): Promise<Client> => {
      const newClient = await prismaVisitRepository.client.create({
        data: {
          name: clientData.name,
          phone: clientData.phone,
          email: clientData.email,
          note: clientData.note,
          birthDate: clientData.birthDate,
        },
      });
      // Map Prisma model to domain entity
      return mapToDomainClient(newClient);
    },
    findById: async (id: string): Promise<Client | null> => {
      const client = await prismaVisitRepository.client.findUnique({
        where: { id },
      });
      return client ? mapToDomainClient(client) : null;
    },
    findByEmail: async (email: string): Promise<Client | null> => {
      const client = await prismaVisitRepository.client.findUnique({
        where: { email }, // 'email' is marked @unique in schema.prisma
      });
      return client ? mapToDomainClient(client) : null;
    },
  };
};

const clientRepositoryDb = createClientRepositoryDb(prisma);

export default clientRepositoryDb;
