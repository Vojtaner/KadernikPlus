"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./prisma"));
const client_mapper_1 = __importDefault(require("../../../infrastructure/mappers/client-mapper"));
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
const createClientRepositoryDb = (prismaVisitRepository) => {
    return {
        findAll: async () => {
            const clients = await prismaVisitRepository.client.findMany();
            return clients.map((client) => (0, client_mapper_1.default)(client));
        },
        add: async (clientData) => {
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
            return (0, client_mapper_1.default)(newClient);
        },
        findById: async (id) => {
            const client = await prismaVisitRepository.client.findUnique({
                where: { id },
            });
            return client ? (0, client_mapper_1.default)(client) : null;
        },
        findByEmail: async (email) => {
            const client = await prismaVisitRepository.client.findUnique({
                where: { email }, // 'email' is marked @unique in schema.prisma
            });
            return client ? (0, client_mapper_1.default)(client) : null;
        },
    };
};
const clientRepositoryDb = createClientRepositoryDb(prisma_1.default);
exports.default = clientRepositoryDb;
