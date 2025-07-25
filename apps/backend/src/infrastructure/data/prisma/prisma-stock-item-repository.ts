import { PrismaClient } from ".prisma/client";
import {
  StockItem,
  StockItemBuyData,
  StockItemCreateData,
} from "../../../../../entities/stock-item";
import { StockItemRepositoryPort } from "../../../application/ports/stock-item-repository";
import prisma from "./prisma";
import { isPurchaseStockItem } from "../../../infrastructure/controllers/stock-item-controller";

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

          if (existingStockItem) {
            const updatedStockItem =
              await prismaStockRepository.stockItem.update({
                where: { id: stockItemId },
                data: {
                  quantity: existingStockItem.quantity + Number(newQuatinty),
                  price: existingStockItem.price + Number(newPrice),
                },
              });

            return updatedStockItem;
          }
        } else {
          const { itemName, unit, quantity, threshold, price, stockId } = data;

          const stockItem = await prismaStockRepository.stockItem.create({
            data: {
              itemName: itemName,
              unit: unit,
              quantity: Number(quantity),
              price: Number(price),
              threshold: Number(threshold),
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
