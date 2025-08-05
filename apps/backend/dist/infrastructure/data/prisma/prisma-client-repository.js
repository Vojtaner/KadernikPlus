"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./prisma"));
const client_mapper_1 = __importDefault(require("../../../infrastructure/mappers/client-mapper"));
const createClientRepositoryDb = (prismaVisitRepository) => {
    return {
        findAll: async () => {
            const clients = await prismaVisitRepository.client.findMany();
            return clients.map((client) => (0, client_mapper_1.default)(client));
        },
        add: async (clientData) => {
            console.log({ clientData });
            const newClient = await prismaVisitRepository.client.create({
                data: {
                    firstName: clientData.firstName,
                    lastName: clientData.lastName,
                    phone: clientData.phone,
                    note: clientData.note,
                    userId: "441245bd-c800-4a0d-ba75-d865002ac09c",
                },
            });
            return (0, client_mapper_1.default)(newClient);
        },
        findById: async (id) => {
            const client = await prismaVisitRepository.client.findUnique({
                where: { id },
            });
            return client ? (0, client_mapper_1.default)(client) : null;
        },
        findByPhone: async (phone) => {
            const client = await prismaVisitRepository.client.findUnique({
                where: { phone }, // 'phone' is marked @unique in schema.prisma
            });
            return client ? (0, client_mapper_1.default)(client) : null;
        },
    };
};
const clientRepositoryDb = createClientRepositoryDb(prisma_1.default);
exports.default = clientRepositoryDb;
