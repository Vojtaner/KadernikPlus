import { Prisma, PrismaClient } from ".prisma/client";
import {
  ProcedureCreateData,
  ProcedureRepositoryPort,
} from "../../../application/ports/procedure-repository";
import prisma from "./prisma";

export const fullProcedureInclude = Prisma.validator<Prisma.ProcedureInclude>()(
  {
    stockAllowances: {
      include: {
        stockItem: true,
      },
    },
  }
);

export type FullProcedure = Prisma.ProcedureGetPayload<{
  include: typeof fullProcedureInclude;
}>;

const createProcedureRepositoryDb = (
  prisma: PrismaClient
): ProcedureRepositoryPort => ({
  findByVisitId: async (visitId: string) => {
    return prisma.procedure.findMany({
      where: { visitId },
      orderBy: { stepOrder: "asc" },
      include: { stockAllowances: { include: { stockItem: true } } },
    });
  },

  addOrUpdate: async (data: ProcedureCreateData) => {
    const { id, userId, visitId, description, stockAllowances = [] } = data;
    console.log({ data });
    const teamMember = await prisma.teamMember.findFirst({ where: { userId } });

    if (!teamMember) {
      throw new Error("Nepodařilo se identifikovat váš tým.");
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
      const incomingIds = new Set(
        stockAllowances.map((s) => s.stockAllowanceId).filter(Boolean)
      );

      const toCreate = stockAllowances.filter((s) => !s.stockAllowanceId);
      const toUpdate = stockAllowances.filter(
        (s) => s.stockAllowanceId && existingIds.has(s.stockAllowanceId)
      );
      const toDelete = [...existingIds].filter((id) => !incomingIds.has(id));

      console.log(existingIds, incomingIds, toCreate, toUpdate);

      return prisma.$transaction(async (tx) => {
        const stockItemIds = stockAllowances.map(
          (stockAllowance) => stockAllowance.stockItemId
        );
        const stockItems = await tx.stockItem.findMany({
          where: { id: { in: stockItemIds } },
          select: { id: true, avgUnitPrice: true, itemName: true },
        });

        const stockItemPriceMap = new Map(
          stockItems.map((si) => [si.id, si.avgUnitPrice])
        );
        const stockItemNameMap = new Map(
          stockItems.map((si) => [si.id, si.itemName])
        );

        const updated = await tx.procedure.update({
          where: { id },
          data: {
            description,
            visit: { connect: { id: visitId } },
            stockAllowances: {
              deleteMany: { id: { in: toDelete } },
              update: toUpdate.map((s) => ({
                where: { id: s.stockAllowanceId! },
                data: {
                  stockItemId: s.stockItemId,
                  quantity: s.quantity,
                  avgUnitPrice: stockItemPriceMap.get(s.stockItemId) ?? 0,
                  stockItemName: stockItemNameMap.get(s.stockItemId) ?? "",
                },
              })),
              create: toCreate.map((s) => ({
                stockItemId: s.stockItemId,
                quantity: s.quantity,
                avgUnitPrice: stockItemPriceMap.get(s.stockItemId) ?? 0,
                stockItemName: stockItemNameMap.get(s.stockItemId) ?? "",
                userId,
                teamId: teamMember.teamId,
              })),
            },
          },
          include: { stockAllowances: { include: { stockItem: true } } },
        });

        if (toDelete.length > 0) {
          const deletedItems = existing.stockAllowances.filter((sa) =>
            toDelete.includes(sa.id)
          );

          await Promise.all(
            deletedItems.map(async (item) => {
              await adjustStockItem(
                tx,
                item.stockItemId,
                Number(item.quantity)
              );
            })
          );
        }

        if (toUpdate.length > 0) {
          await Promise.all(
            toUpdate.map(async (item) => {
              const prev = existing.stockAllowances.find(
                (sa) => sa.id === item.stockAllowanceId
              );
              if (!prev) return;

              if (prev.stockItemId !== item.stockItemId) {
                await adjustStockItem(
                  tx,
                  prev.stockItemId,
                  Number(prev.quantity)
                );
                await adjustStockItem(tx, item.stockItemId, -item.quantity);
              } else {
                const diff = item.quantity - Number(prev.quantity);
                if (diff !== 0) {
                  await adjustStockItem(tx, item.stockItemId, diff);
                }
              }
            })
          );
        }

        if (toCreate.length > 0) {
          await Promise.all(
            toCreate.map(async (item) => {
              await adjustStockItem(tx, item.stockItemId, -item.quantity);
            })
          );
        }

        return updated;
      });
    }

    const stepOrder = await computeStepOrder(visitId);

    return prisma.$transaction(async (tx) => {
      const stockItemIds = stockAllowances.map(
        (stockAllowance) => stockAllowance.stockItemId
      );
      const stockItems = await tx.stockItem.findMany({
        where: { id: { in: stockItemIds } },
        select: { id: true, avgUnitPrice: true, itemName: true },
      });

      const stockItemPriceMap = new Map(
        stockItems.map((si) => [si.id, si.avgUnitPrice])
      );
      const stockItemNameMap = new Map(
        stockItems.map((si) => [si.id, si.itemName])
      );

      const created = await tx.procedure.create({
        data: {
          description,
          stepOrder,
          visit: { connect: { id: visitId } },
          stockAllowances: {
            create: stockAllowances.map((s) => ({
              stockItemId: s.stockItemId,
              quantity: s.quantity,
              avgUnitPrice: stockItemPriceMap.get(s.stockItemId) ?? 0,
              stockItemName: stockItemNameMap.get(s.stockItemId) ?? "",
              userId,
              teamId: teamMember.teamId,
            })),
          },
        },
        include: { stockAllowances: { include: { stockItem: true } } },
      });

      if (stockAllowances.length > 0) {
        await Promise.all(
          stockAllowances.map(async (item) => {
            await adjustStockItem(tx, item.stockItemId, -Number(item.quantity));
          })
        );
      }

      return created;
    });
  },

  delete: async (id: string) => {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.procedure.findUnique({
        where: { id },
        include: { stockAllowances: true },
      });

      if (!existing) {
        throw new Error("Procedura nenalezena.");
      }

      if (existing.stockAllowances.length > 0) {
        await Promise.all(
          existing.stockAllowances.map(async (item) => {
            await adjustStockItem(tx, item.stockItemId, Number(item.quantity));
          })
        );
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

const procedureRepositoryDb = createProcedureRepositoryDb(prisma);

export default procedureRepositoryDb;

async function adjustStockItem(
  tx: Prisma.TransactionClient,
  stockItemId: string,
  quantityDelta: number
) {
  const stockItem = await tx.stockItem.findUnique({
    where: { id: stockItemId },
    select: { quantity: true, totalPrice: true, packageCount: true },
  });

  if (!stockItem) throw new Error(`Stock item ${stockItemId} not found`);

  const oldQuantity = Number(stockItem.quantity);
  const oldTotalPrice = Number(stockItem.totalPrice);
  const oldPackageCount = Number(stockItem.packageCount);

  const oldUnitPrice = oldQuantity > 0 ? oldTotalPrice / oldQuantity : 0;

  const newQuantity = oldQuantity + quantityDelta;
  const priceDelta = oldUnitPrice * quantityDelta;
  const packageDelta =
    oldQuantity > 0
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
      avgUnitPrice: new Prisma.Decimal(newAvgUnitPrice),
    },
  });

  // Optional: check consistency
  const updated = await tx.stockItem.findUnique({ where: { id: stockItemId } });
  if (!updated || Number(updated.quantity) < 0)
    throw new Error(`Stock item ${stockItemId} quantity negative!`);
}

const computeStepOrder = async (visitId: string) => {
  const lastStep = await prisma.procedure.findFirst({
    where: { visitId },
    orderBy: { stepOrder: "desc" },
  });
  return lastStep ? lastStep.stepOrder + 1 : 1;
};
