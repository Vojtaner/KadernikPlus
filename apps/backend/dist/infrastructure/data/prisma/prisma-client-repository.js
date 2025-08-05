"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const prisma_1 = __importDefault(require("./prisma"));
const createClientRepositoryDb = (prismaRepository) => {
    return {
        findAll: async (userId) => {
            const teamMember = await prismaRepository.teamMember.findFirst({
                where: {
                    userId,
                },
            });
            const conditions = [{ userId }];
            if (teamMember?.canAccessClients && teamMember.teamId) {
                conditions.push({ teamId: teamMember.teamId });
            }
            const clients = await prismaRepository.client.findMany({
                where: { AND: conditions },
            });
            return clients;
        },
        search: async (teamId, query, userId) => {
            const teamMember = await prismaRepository.teamMember.findFirst({
                where: {
                    userId,
                },
            });
            const conditions = [
                {
                    userId,
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
            ];
            if (teamMember?.canAccessClients && teamMember.teamId) {
                conditions.push({ teamId });
            }
            const clients = await prismaRepository.client.findMany({
                where: { AND: conditions },
                include: {
                    visits: {
                        include: { visitServices: { include: { service: true } } },
                    },
                },
            });
            return clients;
        },
        addOrUpdate: async (clientData) => {
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
            if (!clientData.firstName || !clientData.lastName) {
                throw new Error("Zadejte jméno klienta.");
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
        findById: async (id, userId) => {
            const teamMember = await prismaRepository.teamMember.findFirst({
                where: { userId },
            });
            const whereConditions = [{ id }];
            if (teamMember?.canAccessClients && teamMember.teamId) {
                whereConditions.push({ teamId: teamMember.teamId });
            }
            const client = await prismaRepository.client.findFirst({
                where: { AND: whereConditions },
                include: { visits: true },
            });
            if (!client) {
                throw new Error("Klient nebyl nalezen.");
            }
            const isOwnClient = !client.teamId;
            const isTeamClient = client.teamId === teamMember?.teamId && teamMember?.canAccessClients;
            if (isOwnClient || isTeamClient) {
                return client;
            }
            throw new Error("Klient neexistuje, není ve vašem týmu nebo k němu nemáte oprávnění.");
        },
        findByPhone: async (phone) => {
            const client = await prismaRepository.client.findUnique({
                where: { phone },
            });
            return client;
        },
    };
};
const clientRepositoryDb = createClientRepositoryDb(prisma_1.default);
exports.default = clientRepositoryDb;
