import { Prisma, PrismaClient, StockItem } from ".prisma/client";
import {
  StockItemBuyData,
  StockItemCreateData,
} from "../../../../../entities/stock-item";
import { StockItemRepositoryPort } from "../../../application/ports/stock-item-repository";
import prisma from "./prisma";
import { isPurchaseStockItem } from "../../../infrastructure/controllers/stock-item-controller";
import { Decimal } from "@prisma/client/runtime/library";

const createStockItemRepositoryDb = (
  prismaStockRepository: PrismaClient
): StockItemRepositoryPort => {
  return {
    createOrUpdateStockItem: async (
      data: StockItemCreateData | StockItemBuyData
    ): Promise<StockItem | undefined> => {
      try {
        if (isPurchaseStockItem(data)) {
          const { price: newPrice, quantity: newQuatinty, stockItemId } = data;
          const existingStockItem =
            await prismaStockRepository.stockItem.findFirst({
              where: {
                id: stockItemId,
              },
            });
          const newPriceFormatted = Number(newPrice);
          const newQuantityFormatted = Number(newQuatinty);
          const averageStockItemPrice = new Decimal(
            (newPriceFormatted / newQuantityFormatted).toFixed(2)
          );
          const totalQuantityNumber =
            Number(existingStockItem ? existingStockItem.quantity : 0) +
            newQuantityFormatted;

          if (existingStockItem) {
            const updatedStockItem =
              await prismaStockRepository.stockItem.update({
                where: { id: stockItemId },
                data: {
                  quantity: new Prisma.Decimal(totalQuantityNumber),
                  price: new Prisma.Decimal(averageStockItemPrice),
                },
              });

            return updatedStockItem;
          }
        } else {
          const { itemName, unit, quantity, threshold, price, stockId } = data;
          const newPriceFormatted = Number(price);
          const newQuantityFormatted = Number(quantity);
          const averageStockItemPrice = new Decimal(
            (newPriceFormatted / newQuantityFormatted).toFixed(2)
          );

          const stockItem = await prismaStockRepository.stockItem.create({
            data: {
              itemName: itemName,
              unit: unit,
              quantity: new Prisma.Decimal(quantity),
              price: new Prisma.Decimal(averageStockItemPrice),
              threshold: new Prisma.Decimal(threshold),
              isActive: true,
              stock: {
                connect: { id: stockId },
              },
            },
          });

          return stockItem;
        }
      } catch (err) {
        // if (
        //   err instanceof PrismaClientKnownRequestError &&
        //   err.code === "P2002"
        // ) {
        //   throw StockItemAlreadyExistsError(data.itemName);
        // }

        throw err;
      }
    },

    getStockItemById: async (
      stockItemId: string
    ): Promise<StockItem | null> => {
      const stockItem = await prismaStockRepository.stockItem.findUnique({
        where: { id: stockItemId },
      });
      return stockItem ?? null;
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

    getStockItemsByStockId: async (stockId: string): Promise<StockItem[]> => {
      const stockItems = await prismaStockRepository.stockItem.findMany({
        where: { stockId: stockId },
      });

      return stockItems;
    },
  };
};

const stockItemRepositoryDb = createStockItemRepositoryDb(prisma);

export default stockItemRepositoryDb;
