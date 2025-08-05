"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVisitRepositoryDb = void 0;
const prisma_1 = __importDefault(require("./prisma"));
const createVisitRepositoryDb = (prismaRepository) => ({
    add: async (visitData) => {
        const userTeam = await prismaRepository.teamMember.findFirst({
            where: { userId: visitData.userId },
        });
        if (!userTeam) {
            throw new Error("User is not assigned to any team.");
        }
        const newVisit = await prismaRepository.visit.create({
            data: {
                clientId: visitData.clientId,
                userId: visitData.userId,
                date: visitData.date,
                paidPrice: Number(visitData.paidPrice),
                teamId: userTeam.teamId,
                visitServices: {
                    create: visitData.serviceIds.map((serviceId) => ({
                        service: { connect: { id: serviceId } },
                    })),
                },
            },
            include: {
                visitServices: true,
            },
        });
        return newVisit;
    },
    updateStatus: async (visitId, checked) => {
        const updatedVisit = await prisma_1.default.visit.update({
            where: { id: visitId },
            data: {
                visitStatus: checked,
            },
        });
        return updatedVisit;
    },
    findAll: async (clientId) => {
        const whereClause = clientId ? { clientId } : {};
        const visits = await prismaRepository.visit.findMany({
            where: whereClause,
            include: {
                client: true,
                visitServices: {
                    include: {
                        service: true,
                    },
                },
            },
        });
        return visits;
    },
    findById: async (visitId) => {
        const visit = await prismaRepository.visit.findUnique({
            where: { id: visitId },
            include: {
                client: true,
                user: true,
                procedures: {
                    include: { stockAllowances: { include: { stockItem: true } } },
                },
                visitServices: {
                    include: {
                        service: true,
                    },
                },
            },
        });
        return visit ? visit : null;
    },
    findByDate: async (filter) => {
        const { date, from, to, userId } = filter;
        const where = {
            userId,
        };
        if (date) {
            const start = new Date(date);
            start.setHours(0, 0, 0, 0);
            const end = new Date(date);
            end.setHours(23, 59, 59, 999);
            where.date = {
                gte: start,
                lte: end,
            };
        }
        else if (from && to) {
            where.date = {
                gte: new Date(from),
                lte: new Date(to),
            };
        }
        else if (from) {
            where.date = {
                gte: new Date(from),
            };
        }
        else if (to) {
            where.date = {
                lte: new Date(to),
            };
        }
        const visits = await prismaRepository.visit.findMany({
            where,
            include: {
                client: true,
                user: true,
                procedures: {
                    include: { stockAllowances: { include: { stockItem: true } } },
                },
                visitServices: {
                    include: {
                        service: true,
                    },
                },
            },
        });
        return visits;
    },
    delete: async (id) => {
        await prismaRepository.$transaction([
            prismaRepository.visitService.deleteMany({
                where: { visitId: id },
            }),
            prismaRepository.photo.deleteMany({
                where: { visitId: id },
            }),
            prismaRepository.procedure.deleteMany({
                where: { visitId: id },
            }),
            prismaRepository.visit.delete({
                where: { id },
            }),
        ]);
    },
    update: async (visitData) => {
        const updatedVisit = await prismaRepository.visit.update({
            where: { id: visitData.id },
            data: {
                paidPrice: visitData.paidPrice,
                date: visitData.date,
                deposit: Number(visitData.deposit),
                note: visitData.note,
                depositStatus: { set: visitData.depositStatus }, //po restartu dockeru se srovná
            },
            include: {
                visitServices: true,
            },
        });
        return updatedVisit;
    },
});
exports.createVisitRepositoryDb = createVisitRepositoryDb;
const visitRepositoryDb = (0, exports.createVisitRepositoryDb)(prisma_1.default);
exports.default = visitRepositoryDb;
