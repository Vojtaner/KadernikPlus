import { Prisma, PrismaClient, Stock, StockItem } from ".prisma/client";
import { StockItemCreateData } from "../../../entities/stock-item";
import { StockItemRepositoryPort } from "../../../application/ports/stock-item-repository";
import prisma from "./prisma";
import { isPurchaseStockItem } from "../../../infrastructure/controllers/stock-item-controller";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { DEFAULT_USERS_TEAM } from "../../../entities/team-member";
import StockItemAlreadyExistsError from "../../../domain/errors/stock-item-errors";
import { httpError } from "../../../adapters/express/httpError";

const createStockItemRepositoryDb = (
  prismaStockRepository: PrismaClient
): StockItemRepositoryPort => {
  return {
    deleteAll: async (stockId: string): Promise<Prisma.BatchPayload> => {
      console.log({ stockId });
      return await prisma.stockItem.updateMany({
        where: { stockId },
        data: { isActive: false },
      });
    },
    createOrUpdateStockItem: async (
      data: StockItemCreateData
    ): Promise<StockItem | undefined> => {
      try {
        const isPurchase = isPurchaseStockItem(data);

        if (isPurchase) {
          const { id, totalPrice, quantity, packageCount } = data;
          const existing = await prismaStockRepository.stockItem.findFirst({
            where: { id },
          });

          if (!existing) {
            throw httpError("Nepodařilo se najít položku na skladu.", 404);
          }

          const newQuantityPerPiece = Number(quantity);
          const newTotalPrice = Number(totalPrice);
          const newPackageCount = Number(packageCount);

          const newTotalQuantity = newQuantityPerPiece * newPackageCount;

          const updatedQuantity = newTotalQuantity + Number(existing.quantity);
          const updatedTotalPrice = newTotalPrice + Number(existing.totalPrice);
          const updatedPackageCount =
            newPackageCount + Number(existing.packageCount);

          const updatedAvgPrice =
            updatedQuantity > 0 ? updatedTotalPrice / updatedQuantity : 0;

          if (existing) {
            return await prismaStockRepository.stockItem.update({
              where: { id },
              data: {
                quantity: new Prisma.Decimal(updatedQuantity),
                totalPrice: new Prisma.Decimal(updatedTotalPrice),
                avgUnitPrice: new Prisma.Decimal(updatedAvgPrice),
                packageCount: new Prisma.Decimal(updatedPackageCount),
                lastPackageQuantity: new Prisma.Decimal(quantity),
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
            totalPrice,
            threshold,
            unit,
            stockId,
            packageCount,
          } = data;

          const updatedQuantity = packageCount * quantity;
          const avgPrice =
            updatedQuantity > 0 ? totalPrice / updatedQuantity : 0;

          return await prisma.stockItem.update({
            where: { id },
            data: {
              itemName,
              quantity: new Prisma.Decimal(updatedQuantity),
              totalPrice: new Prisma.Decimal(totalPrice),
              avgUnitPrice: new Prisma.Decimal(avgPrice),
              threshold: new Prisma.Decimal(threshold),
              packageCount: new Prisma.Decimal(packageCount),
              lastPackageQuantity: new Prisma.Decimal(quantity),
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
          totalPrice,
          stockId,
          packageCount,
        } = data;

        const updatedQuantity = packageCount * quantity;
        const avgPrice = updatedQuantity > 0 ? totalPrice / updatedQuantity : 0;
        const itemNameAlreadyExists = await prisma.stockItem.findUnique({
          where: {
            stockId_itemName_isActive: {
              stockId: data.stockId,
              itemName: data.itemName,
              isActive: true,
            },
          },
        });

        if (itemNameAlreadyExists) {
          throw httpError("Položka na vašem skladu už existuje.", 409);
        }

        return await prismaStockRepository.stockItem.create({
          data: {
            itemName,
            unit,
            quantity: new Prisma.Decimal(updatedQuantity),
            totalPrice: new Prisma.Decimal(totalPrice),
            avgUnitPrice: new Prisma.Decimal(avgPrice),
            threshold: new Prisma.Decimal(threshold),
            isActive: true,
            packageCount: new Prisma.Decimal(packageCount),
            lastPackageQuantity: new Prisma.Decimal(quantity),
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

      if (!teamMember) {
        throw new Error("Nejste součástí žádného týmu.");
      }

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
    getStockItemsByStocks: async (
      stockIds: string[]
    ): Promise<
      (Stock & {
        stockItems: StockItem[];
      })[]
    > => {
      const stockItemsByStock = await prisma.stock.findMany({
        where: { id: { in: stockIds } },
        include: {
          stockItems: {
            where: {
              isActive: true, // only active items
            },
          },
        },
      });

      return stockItemsByStock;
    },
  };
};

const stockItemRepositoryDb = createStockItemRepositoryDb(prisma);

export default stockItemRepositoryDb;
