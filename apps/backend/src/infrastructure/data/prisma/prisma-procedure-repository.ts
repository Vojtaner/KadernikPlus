import { Prisma, PrismaClient } from ".prisma/client";
import {
  ProcedureCreateData,
  ProcedureRepositoryPort,
  StockAllowanceProcedureType,
} from "../../../application/ports/procedure-repository";
import prisma from "./prisma";
import logRepositoryDb from "./prisma-log-repository";
import visitRepositoryDb from "./prisma-visit-repository";
import dayjs from "dayjs";
import stockItemRepositoryDb from "./prisma-stock-item-repository";

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
    const procedures = await prisma.procedure.findMany({
      where: { visitId },
      orderBy: { stepOrder: "asc" },
      include: { stockAllowances: { include: { stockItem: true } } },
    });

    return procedures.map((proc) => ({
      ...proc,
      stockAllowances: proc.stockAllowances.map((sa) => ({
        ...sa,
        stockAllowanceId: sa.id,
      })),
    }));
  },

  addOrUpdate: async (data: ProcedureCreateData) => {
    const { id, userId, visitId, description, stockAllowances = [] } = data;
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

      const visit = await visitRepositoryDb.findById(visitId);

      const diff = getStockAllowanceDiff(
        existing.stockAllowances,
        stockAllowances
      );

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
              deleteMany: { id: { in: diff.toDelete.map((s) => s.id!) } },
              update: diff.toUpdate.map((s) => ({
                where: { id: s.stockAllowanceId! },
                data: {
                  stockItemId: s.stockItemId,
                  quantity: s.quantity,
                  avgUnitPrice: stockItemPriceMap.get(s.stockItemId) ?? 0,
                  stockItemName: stockItemNameMap.get(s.stockItemId) ?? "",
                },
              })),
              create: diff.toCreate.map((s) => ({
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

        await Promise.all(
          diff.toDelete.map(async (item) => {
            await adjustStockItem(tx, item.stockItemId, Number(item.quantity));

            const stockItem = await stockItemRepositoryDb.getStockItemById(
              item.stockItemId,
              userId
            );

            await logRepositoryDb.log({
              userId,
              action: "delete",
              entityType: "stockItem",
              entityId: item.stockItemId,
              message: `Smazána položka procedury: Návštěva ${dayjs(
                visit?.date
              ).format("DD.MM.YYYY")}/${visit?.client?.lastName ?? ""} ${
                item.stockItemName
              }, množství: ${item.quantity}${stockItem?.unit}`,
              metadata: { item },
              teamId: teamMember.teamId,
            });
          })
        );

        await Promise.all(
          diff.toUpdate.map(async (item) => {
            const prev = existing.stockAllowances.find(
              (sa) => sa.id === item.stockAllowanceId
            );

            if (!prev) {
              return;
            }

            if (prev.stockItemId !== item.stockItemId) {
              await adjustStockItem(
                tx,
                prev.stockItemId,
                Number(prev.quantity)
              );
              await adjustStockItem(tx, item.stockItemId, -item.quantity);
            } else {
              const diffQty = item.quantity - Number(prev.quantity);
              if (diffQty !== 0) {
                await adjustStockItem(tx, item.stockItemId, diffQty);
              }
            }

            const stockItem = await stockItemRepositoryDb.getStockItemById(
              item.stockItemId,
              userId
            );

            await logRepositoryDb.log({
              userId,
              action: "update",
              entityType: "stockItem",
              entityId: item.stockItemId,
              message: `Upravena položka procedury: Návštěva ${dayjs(
                visit?.date
              ).format("DD.MM.YYYY")}/${visit?.client?.lastName ?? ""} ${
                prev.stockItemName
              } z hodnoty ${prev.quantity}${stockItem?.unit} na ${
                item.quantity
              }${stockItem?.unit}`,
              metadata: { prev, item },
              teamId: teamMember.teamId,
            });
          })
        );

        await Promise.all(
          diff.toCreate.map(async (item) => {
            await adjustStockItem(tx, item.stockItemId, -item.quantity);

            const stockItem = await stockItemRepositoryDb.getStockItemById(
              item.stockItemId,
              userId
            );

            await logRepositoryDb.log({
              userId,
              action: "create",
              entityType: "stockItem",
              entityId: item.stockItemId,
              message: `Přidána položka procedury: Návštěva ${dayjs(
                visit?.date
              ).format("DD.MM.YYYY")}/${visit?.client?.lastName ?? ""} ${
                stockItem?.activeName
              }, množství: ${item.quantity}${stockItem?.unit}`,
              metadata: { item },
              teamId: teamMember.teamId,
            });
          })
        );

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
            await logRepositoryDb.log({
              userId,
              action: "create",
              entityType: "stockItem",
              entityId: item.stockItemId,
              message: `Přidána zásobní položka: ${item.stockItemId} (${item.quantity})`,
              metadata: { item },
              teamId: teamMember.teamId,
            });
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

function getStockAllowanceDiff(
  existing: StockAllowanceProcedureType[],
  incoming: ProcedureCreateData["stockAllowances"] = []
) {
  const incomingIds = new Set(
    incoming.map((s) => s.stockAllowanceId).filter(Boolean)
  );
  const toDelete = existing.filter((s) => s.id && !incomingIds.has(s.id!));

  const toCreate = incoming.filter((s) => !s.stockAllowanceId);

  const existingMap = new Map(existing.map((s) => [s.id, s]));
  const toUpdate = incoming.filter((s) => {
    if (!s.stockAllowanceId || !existingMap.has(s.stockAllowanceId))
      return false;
    const prev = existingMap.get(s.stockAllowanceId);
    return (
      prev &&
      (prev.stockItemId !== s.stockItemId ||
        Number(prev.quantity) !== Number(s.quantity))
    );
  });

  return { toCreate, toUpdate, toDelete };
}
