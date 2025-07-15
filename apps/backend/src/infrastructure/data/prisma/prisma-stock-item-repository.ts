import { PrismaClient } from "@prisma/client";
import {
  StockItem,
  StockItemCreateData,
} from "../../../../../entities/stock-item";
import { StockItemRepositoryPort } from "../../../application/ports/stock-item-repository";
import mapToDomainStockItem from "../../../infrastructure/mappers/stockItem-mapper";
import prisma from "./prisma";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import StockItemAlreadyExistsError from "../../../domain/errors/stock-item-errors";

const createStockItemRepositoryDb = (
  prismaStockRepository: PrismaClient
): StockItemRepositoryPort => {
  return {
    createStockItem: async (data: StockItemCreateData): Promise<StockItem> => {
      try {
        const stockItem = await prismaStockRepository.stockItem.create({
          data: {
            itemName: data.itemName,
            unit: data.unit,
            quantity: data.quantity,
            price: data.price,
            threshold: data.threshold,
            isActive: true,
            stock: {
              connect: { id: data.stockId },
            },
          },
        });
        return mapToDomainStockItem(stockItem);
      } catch (err) {
        if (
          err instanceof PrismaClientKnownRequestError &&
          err.code === "P2002"
        ) {
          throw StockItemAlreadyExistsError(data.itemName);
        }

        throw err;
      }
    },

    getStockItemById: async (
      stockItemId: string
    ): Promise<StockItem | null> => {
      const stockItem = await prismaStockRepository.stockItem.findUnique({
        where: { id: stockItemId },
      });
      return stockItem ? mapToDomainStockItem(stockItem) : null;
    },

    findStockItemByName: async (
      itemName: string
    ): Promise<StockItem | null> => {
      //tady ten endpoint asi nebude potřeba
      const stockItem = await prismaStockRepository.stockItem.findFirst({
        where: { itemName: itemName },
      });
      return stockItem ? mapToDomainStockItem(stockItem) : null;
    },

    getStockItemsByStockId: async (stockId: string): Promise<StockItem[]> => {
      const stockItems = await prismaStockRepository.stockItem.findMany({
        where: { stockId: stockId },
      });
      return stockItems.map((stockItem) => mapToDomainStockItem(stockItem));
    },
  };
};

const stockItemRepositoryDb = createStockItemRepositoryDb(prisma);

export default stockItemRepositoryDb;
