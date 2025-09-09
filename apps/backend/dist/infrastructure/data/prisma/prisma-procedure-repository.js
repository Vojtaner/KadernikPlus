"use strict";
!function(){try{var e="undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&(e._sentryDebugIds=e._sentryDebugIds||{},e._sentryDebugIds[n]="ffcbc150-e430-5b26-a3ee-3440e1299033")}catch(e){}}();

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
        const teamMember = await prisma.teamMember.findFirst({ where: { userId } });
        if (!teamMember) {
            throw new Error("Nepodařilo se identifikovat váš team.");
        }
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
                                teamId: teamMember.teamId,
                            })),
                        },
                    },
                    include: { stockAllowances: { include: { stockItem: true } } },
                });
                // Handle stock restore for deleted allowances
                if (toDelete.length > 0) {
                    const deletedItems = existing.stockAllowances.filter((sa) => toDelete.includes(sa.id));
                    await Promise.all(deletedItems.map(async (item) => {
                        await adjustStockItem(tx, item.stockItemId, Number(item.quantity));
                    }));
                }
                // Handle stock adjust for updated allowances
                if (toUpdate.length > 0) {
                    await Promise.all(toUpdate.map(async (item) => {
                        const prev = existing.stockAllowances.find((sa) => sa.id === item.stockAllowanceId);
                        if (!prev)
                            return;
                        // if stockItem changed
                        if (prev.stockItemId !== item.stockItemId) {
                            // restore old stock
                            await adjustStockItem(tx, prev.stockItemId, Number(prev.quantity));
                            // decrement new stock
                            await adjustStockItem(tx, item.stockItemId, -item.quantity);
                        }
                        else {
                            // same stockItem → adjust by delta
                            const diff = item.quantity - Number(prev.quantity);
                            if (diff !== 0) {
                                // use adjustStockItem with quantity delta
                                await adjustStockItem(tx, item.stockItemId, diff);
                            }
                        }
                    }));
                }
                // Handle stock decrement for newly created allowances
                if (toCreate.length > 0) {
                    await Promise.all(toCreate.map(async (item) => {
                        await adjustStockItem(tx, item.stockItemId, -item.quantity);
                    }));
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
                            teamId: teamMember.teamId,
                        })),
                    },
                },
                include: { stockAllowances: { include: { stockItem: true } } },
            });
            if (stockAllowances.length > 0) {
                await Promise.all(stockAllowances.map(async (item) => {
                    await adjustStockItem(tx, item.stockItemId, -Number(item.quantity));
                }));
            }
            return created;
        });
    },
    delete: async (id) => {
        await prisma.$transaction(async (tx) => {
            const existing = await tx.procedure.findUnique({
                where: { id },
                include: { stockAllowances: true },
            });
            if (!existing) {
                throw new Error("Procedura nenalezena.");
            }
            // Restore stock quantities and packageCount
            if (existing.stockAllowances.length > 0) {
                await Promise.all(existing.stockAllowances.map(async (item) => {
                    await adjustStockItem(tx, item.stockItemId, Number(item.quantity));
                }));
            }
            await tx.stockAllowance.deleteMany({
                where: { procedureId: id },
            });
            return tx.procedure.delete({
                where: { id },
            });
        });
        return id;
    },
});
const procedureRepositoryDb = createProcedureRepositoryDb(prisma_1.default);
exports.default = procedureRepositoryDb;
async function adjustStockItem(tx, stockItemId, quantityDelta) {
    const stockItem = await tx.stockItem.findUnique({
        where: { id: stockItemId },
        select: { quantity: true, totalPrice: true, packageCount: true },
    });
    if (!stockItem)
        throw new Error(`Stock item ${stockItemId} not found`);
    const oldQuantity = Number(stockItem.quantity);
    const oldTotalPrice = Number(stockItem.totalPrice);
    const oldPackageCount = Number(stockItem.packageCount);
    const oldUnitPrice = oldQuantity > 0 ? oldTotalPrice / oldQuantity : 0;
    const newQuantity = oldQuantity + quantityDelta;
    const priceDelta = oldUnitPrice * quantityDelta;
    const packageDelta = oldQuantity > 0
        ? (oldPackageCount * newQuantity) / oldQuantity - oldPackageCount
        : 0;
    const newTotalPrice = oldTotalPrice + priceDelta;
    const newAvgUnitPrice = newQuantity > 0 ? newTotalPrice / newQuantity : 0;
    await tx.stockItem.update({
        where: { id: stockItemId },
        data: {
            quantity: { increment: quantityDelta },
            totalPrice: { increment: priceDelta },
            packageCount: { increment: packageDelta },
            avgUnitPrice: new client_1.Prisma.Decimal(newAvgUnitPrice),
        },
    });
    // Optional: check consistency
    const updated = await tx.stockItem.findUnique({ where: { id: stockItemId } });
    if (!updated || Number(updated.quantity) < 0)
        throw new Error(`Stock item ${stockItemId} quantity negative!`);
}
//# sourceMappingURL=prisma-procedure-repository.js.map
//# debugId=ffcbc150-e430-5b26-a3ee-3440e1299033
