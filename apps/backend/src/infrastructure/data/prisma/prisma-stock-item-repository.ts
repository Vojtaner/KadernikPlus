import { Prisma, PrismaClient, StockItem } from ".prisma/client";
import { StockItemCreateData } from "../../../entities/stock-item";
import { StockItemRepositoryPort } from "../../../application/ports/stock-item-repository";
import prisma from "./prisma";
import { isPurchaseStockItem } from "../../../infrastructure/controllers/stock-item-controller";
import {
  Decimal,
  PrismaClientKnownRequestError,
} from "@prisma/client/runtime/library";
import { DEFAULT_USERS_TEAM } from "../../../entities/team-member";
import StockItemAlreadyExistsError from "../../../domain/errors/stock-item-errors";

const createStockItemRepositoryDb = (
  prismaStockRepository: PrismaClient
): StockItemRepositoryPort => {
  return {
    createOrUpdateStockItem: async (
      data: StockItemCreateData
    ): Promise<StockItem | undefined> => {
      try {
        const getAvgPrice = (price: number, quantity: number) =>
          new Decimal((price / quantity).toFixed(2));

        const isPurchase = isPurchaseStockItem(data);

        console.log({ isPurchase, data });
        if (isPurchase) {
          const { id, price, quantity, packageCount } = data;
          const existing = await prismaStockRepository.stockItem.findFirst({
            where: { id },
          });

          const newQty = Number(quantity);
          const newPrice = Number(price);
          const newPackageCount = Number(packageCount);
          const avgPrice = getAvgPrice(newPrice, newQty);
          const totalQty = Number(existing?.quantity ?? 0) + newQty;
          const totalPackageCount =
            Number(existing?.packageCount ?? 0) + newPackageCount;

          console.log({
            newQty,
            newPackageCount,
            newPrice,
            avgPrice,
            totalPackageCount,
            totalQty,
          });

          if (existing) {
            console.log("exisitng");
            return await prismaStockRepository.stockItem.update({
              where: { id },
              data: {
                quantity: new Prisma.Decimal(totalQty),
                price: new Prisma.Decimal(avgPrice),
                packageCount: new Prisma.Decimal(totalPackageCount),
              },
            });
          }

          return;
        }

        if (data.id) {
          const {
            id,
            itemName,
            quantity,
            price,
            threshold,
            unit,
            stockId,
            packageCount,
          } = data;
          const avgPrice = getAvgPrice(Number(price), Number(quantity));

          return await prisma.stockItem.update({
            where: { id },
            data: {
              itemName,
              quantity: new Prisma.Decimal(quantity),
              price: new Prisma.Decimal(avgPrice),
              threshold: new Prisma.Decimal(threshold),
              packageCount: new Prisma.Decimal(packageCount),
              unit,
              stockId,
            },
          });
        }

        const {
          itemName,
          unit,
          quantity,
          threshold,
          price,
          stockId,
          packageCount,
        } = data;
        const avgPrice = getAvgPrice(Number(price), Number(quantity));

        return await prismaStockRepository.stockItem.create({
          data: {
            itemName,
            unit,
            quantity: new Prisma.Decimal(quantity),
            price: new Prisma.Decimal(avgPrice),
            threshold: new Prisma.Decimal(threshold),
            isActive: true,
            packageCount: new Prisma.Decimal(packageCount),

            stock: { connect: { id: stockId } },
          },
        });
      } catch (err) {
        if (
          err instanceof PrismaClientKnownRequestError &&
          err.code === "P2002"
        ) {
          throw StockItemAlreadyExistsError();
        }

        throw err;
      }
    },
    deleteStockItem: async (id: string, userId: string): Promise<void> => {
      const teamMember = await prismaStockRepository.teamMember.findFirst({
        where: { userId },
      });

      const stockItem = await prismaStockRepository.stockItem.findUnique({
        where: { id },
        include: { stock: true },
      });

      if (!stockItem) {
        throw new Error("Položka skladu nebyla nalezena.");
      }

      const isOwnStock =
        stockItem.stock.teamId === DEFAULT_USERS_TEAM &&
        stockItem.stock.ownerId === userId;

      const isTeamStock =
        stockItem.stock.teamId === teamMember?.teamId &&
        teamMember?.canAccessStocks;

      if (!isOwnStock && !isTeamStock) {
        throw new Error("Nemáte oprávnění k odstranění této položky skladu.");
      }

      await prismaStockRepository.stockItem.update({
        where: { id },
        data: { isActive: false },
      });
    },

    getStockItemById: async (
      stockItemId: string,
      userId: string
    ): Promise<StockItem | null> => {
      const teamMember = await prismaStockRepository.teamMember.findFirst({
        where: { userId },
      });

      const stockItem = await prismaStockRepository.stockItem.findUnique({
        where: { id: stockItemId, isActive: true },
        include: { stock: true },
      });

      if (!stockItem) {
        throw new Error("Položka skladu nebyla nalezena.");
      }

      const isOwnStock =
        stockItem.stock.teamId === DEFAULT_USERS_TEAM &&
        stockItem.stock.ownerId === userId;

      const isTeamStock =
        stockItem.stock.teamId === teamMember?.teamId &&
        teamMember?.canAccessStocks;

      if (isOwnStock || isTeamStock) {
        return stockItem;
      }

      throw new Error("Nemáte oprávnění k přístupu k této položce skladu.");
    },

    findStockItemByName: async (
      itemName: string
    ): Promise<StockItem | null> => {
      //tady ten endpoint asi nebude potřeba
      const stockItem = await prismaStockRepository.stockItem.findFirst({
        where: { itemName: itemName },
      });
      return stockItem ?? null;
    },

    getStockItemsByStockId: async (
      stockId: string,
      userId: string
    ): Promise<StockItem[]> => {
      const teamMember = await prisma.teamMember.findUnique({
        where: { userId },
      });

      if (teamMember?.canAccessStocks) {
        const stockIds = await prismaStockRepository.stock
          .findMany({
            where: { teamId: teamMember?.teamId },
          })
          .then((stocks) => {
            return stocks
              .map((stock) => stock.id)
              .filter((stock) => stock !== null);
          });

        if (stockIds.length === 0) {
          throw new Error("Žádné zásoby nenalezeny.");
        }

        const stockItems = await prismaStockRepository.stockItem.findMany({
          where: { stockId: { in: stockIds }, isActive: true },
        });

        return stockItems;
      } else {
        const stock = await prismaStockRepository.stock.findFirst({
          where: { ownerId: teamMember?.userId },
        });

        const stockItems = await prismaStockRepository.stockItem.findMany({
          where: { stockId: stock?.id, isActive: true },
        });

        return stockItems;
      }
    },
  };
};

const stockItemRepositoryDb = createStockItemRepositoryDb(prisma);

export default stockItemRepositoryDb;
