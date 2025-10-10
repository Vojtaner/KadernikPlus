import { Prisma, PrismaClient, StockAllowance } from ".prisma/client";
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
import { httpError } from "../../../adapters/express/httpError";

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
    const {
      id: procedureId,
      userId,
      visitId,
      description,
      stockAllowances = [],
    } = data;

    const teamMember = await prisma.teamMember.findFirst({ where: { userId } });

    if (!teamMember) {
      throw new Error("Nepodařilo se identifikovat váš tým.");
    }
    const visit = await visitRepositoryDb.findById(visitId);

    if (procedureId) {
      const existingProcedure = await prisma.procedure.findUnique({
        where: { id: procedureId },
        include: { stockAllowances: true },
      });

      if (!existingProcedure) {
        throw httpError("Procedura nenalezena.", 404);
      }

      const { toCreate, toUpdate, toDelete } = diffStockAllowances(
        existingProcedure.stockAllowances,
        stockAllowances
      );

      return prisma.$transaction(async (tx) => {
        //nové změny a jeji sotckitemId
        const stockItemIds = stockAllowances.map(
          (stockAllowance) => stockAllowance.stockItemId
        );

        //nalezeny skladové položky
        const stockItems = await tx.stockItem.findMany({
          where: { id: { in: stockItemIds } },
          select: { id: true, avgUnitPrice: true, itemName: true },
        });

        const stockItemPriceMap = new Map(
          stockItems.map((stockItem) => [stockItem.id, stockItem.avgUnitPrice])
        );

        const stockItemNameMap = new Map(
          stockItems.map((stockItem) => [stockItem.id, stockItem.itemName])
        );

        const updated = await tx.procedure.update({
          where: { id: procedureId },
          data: {
            description,
            visit: { connect: { id: visitId } },
            stockAllowances: {
              deleteMany: { id: { in: toDelete.map((s) => s.id) } },
              update: toUpdate.map((s) => ({
                where: { id: s.id },
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

        await Promise.all(
          toDelete.map(async (item) => {
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
          toUpdate.map(async (item) => {
            const existingStockAllowance =
              existingProcedure.stockAllowances.find(
                (stockAllowance) => stockAllowance.id === item.id
              );

            const stockItem = await stockItemRepositoryDb.getStockItemById(
              item.stockItemId,
              userId
            );

            if (!existingStockAllowance) {
              return;
            }

            if (existingStockAllowance.stockItemId !== item.stockItemId) {
              await adjustStockItem(
                tx,
                existingStockAllowance.stockItemId,
                Number(existingStockAllowance.quantity)
              );
              await adjustStockItem(tx, item.stockItemId, -item.quantity);
            } else {
              const diffQuantity =
                0 - item.quantity + Number(existingStockAllowance.quantity);

              if (diffQuantity !== 0) {
                await adjustStockItem(tx, item.stockItemId, diffQuantity);
              }
            }

            await logRepositoryDb.log({
              userId,
              action: "update",
              entityType: "stockItem",
              entityId: item.stockItemId,
              message: `Upravena položka procedury: Návštěva ${dayjs(
                visit?.date
              ).format("DD.MM.YYYY")}/${visit?.client?.lastName ?? ""} ${
                existingStockAllowance.stockItemName
              } z hodnoty ${existingStockAllowance.quantity}${
                stockItem?.unit
              } na ${item.quantity}${stockItem?.unit}`,
              metadata: { existingStockAllowance, item },
              teamId: teamMember.teamId,
            });
          })
        );

        await Promise.all(
          toCreate.map(async (item) => {
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

  if (!stockItem) {
    throw httpError(`Skladová položka ${stockItemId} nenalezena`, 404);
  }

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

  const updated = await tx.stockItem.findUnique({ where: { id: stockItemId } });
  if (!updated || Number(updated.quantity) < 0)
    throw new Error(`Skladová položka ${updated?.itemName} množství záporné!`);
}

const computeStepOrder = async (visitId: string) => {
  const lastStep = await prisma.procedure.findFirst({
    where: { visitId },
    orderBy: { stepOrder: "desc" },
  });
  return lastStep ? lastStep.stepOrder + 1 : 1;
};

type ListStockAllowanceType = {
  id: string;
  quantity: number;
  stockItemId: string;
  stockItemName: string | null;
};

const diffStockAllowances = (
  existing: StockAllowance[],
  modified: {
    id: string;
    stockItemId: string;
    stockAllowanceId?: string;
    quantity: number;
    userId: string;
  }[]
) => {
  const toCreate: Omit<ListStockAllowanceType, "stockItemName">[] = [];
  const toUpdate: ListStockAllowanceType[] = [];
  const toDelete: ListStockAllowanceType[] = [];

  for (const item of existing) {
    const match = modified.find((m) => m.stockAllowanceId === item.id);

    if (!match) {
      toDelete.push({
        id: item.id,
        quantity: Number(item.quantity),
        stockItemId: item.stockItemId,
        stockItemName: item.stockItemName,
      });
    } else if (match.quantity !== Number(item.quantity)) {
      toUpdate.push({
        id: item.id,
        quantity: match.quantity,
        stockItemId: match.stockItemId,
        stockItemName: item.stockItemName,
      });
    }
  }

  for (const item of modified) {
    const match = existing.find((e) => e.id === item.stockAllowanceId);
    if (!match) {
      toCreate.push({
        id: item.id,
        quantity: item.quantity,
        stockItemId: item.stockItemId,
      });
    }
  }

  return { toCreate, toDelete, toUpdate };
};
