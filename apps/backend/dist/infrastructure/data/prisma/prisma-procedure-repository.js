"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.fullProcedureInclude = void 0;
const client_1 = require(".prisma/client");
const prisma_1 = __importDefault(require("./prisma"));
exports.fullProcedureInclude = client_1.Prisma.validator()({
    stockAllowances: {
        include: {
            stockItem: true,
        },
    },
});
const createProcedureRepositoryDb = (prisma) => ({
    findByVisitId: async (visitId) => {
        return prisma.procedure.findMany({
            where: { visitId },
            orderBy: { stepOrder: "asc" },
            include: { stockAllowances: { include: { stockItem: true } } },
        });
    },
    addOrUpdate: async (data) => {
        const { id, userId, visitId, description, stockAllowances = [] } = data;
        const computeStepOrder = async () => {
            const lastStep = await prisma.procedure.findFirst({
                where: { visitId },
                orderBy: { stepOrder: "desc" },
            });
            return lastStep ? lastStep.stepOrder + 1 : 1;
        };
        if (id) {
            const existing = await prisma.procedure.findUnique({
                where: { id },
                include: { stockAllowances: true },
            });
            if (!existing) {
                throw new Error("Procedura nenalezena.");
            }
            const existingIds = new Set(existing.stockAllowances.map((s) => s.id));
            const incomingIds = new Set(stockAllowances.map((s) => s.stockAllowanceId).filter(Boolean));
            const toCreate = stockAllowances.filter((s) => !s.stockAllowanceId);
            const toUpdate = stockAllowances.filter((s) => s.stockAllowanceId && existingIds.has(s.stockAllowanceId));
            const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));
            return prisma.$transaction(async (tx) => {
                const updated = await tx.procedure.update({
                    where: { id },
                    data: {
                        description,
                        visit: { connect: { id: visitId } },
                        stockAllowances: {
                            deleteMany: { id: { in: toDelete } },
                            update: toUpdate.map((s) => ({
                                where: { id: s.stockAllowanceId },
                                data: {
                                    stockItemId: s.stockItemId,
                                    quantity: s.quantity,
                                },
                            })),
                            create: toCreate.map((s) => ({
                                stockItemId: s.stockItemId,
                                quantity: s.quantity,
                                userId,
                            })),
                        },
                    },
                    include: { stockAllowances: { include: { stockItem: true } } },
                });
                if (toCreate.length > 0) {
                    await Promise.all(toCreate.map((item) => tx.stockItem.update({
                        where: { id: item.stockItemId },
                        data: {
                            quantity: {
                                decrement: item.quantity,
                            },
                        },
                    })));
                }
                return updated;
            });
        }
        const stepOrder = await computeStepOrder();
        return prisma.$transaction(async (tx) => {
            const created = await tx.procedure.create({
                data: {
                    description,
                    stepOrder,
                    visit: { connect: { id: visitId } },
                    stockAllowances: {
                        create: stockAllowances.map((s) => ({
                            stockItemId: s.stockItemId,
                            quantity: s.quantity,
                            userId,
                        })),
                    },
                },
                include: { stockAllowances: { include: { stockItem: true } } },
            });
            if (stockAllowances.length > 0) {
                await Promise.all(stockAllowances.map((item) => tx.stockItem.update({
                    where: { id: item.stockItemId },
                    data: {
                        quantity: {
                            decrement: item.quantity,
                        },
                    },
                })));
            }
            return created;
        });
    },
});
const procedureRepositoryDb = createProcedureRepositoryDb(prisma_1.default);
exports.default = procedureRepositoryDb;
