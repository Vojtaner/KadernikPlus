import { PrismaClient } from "@prisma/client";
import {
  StockItem,
  StockItemCreateData,
  UnitsObject,
} from "../../../../../entities/stock-item";
import { StockItemRepositoryPort } from "@/application/ports/stock-item-repository";
import mapToDomainStockItem from "../../../infrastructure/mappers/stockItem-mapper";
import prisma from "./prisma";

const createStockItemRepositoryDb = (
  prismaStockRepository: PrismaClient
): StockItemRepositoryPort => {
  return {
    createStockItem: async (data: StockItemCreateData): Promise<StockItem> => {
      const stockItem = await prismaStockRepository.stockItem.create({
        data: {
          itemName: data.itemName,
          unit: data.unit,
          quantity: data.quantity,
          threshold: data.threshold,
          isActive: true,
          stock: {
            connect: { id: "1" },
          },
        },
      });

      return mapToDomainStockItem(stockItem);
    },

    getStockItemById: async (id: string): Promise<StockItem | null> => {
      const stockItem = await prismaStockRepository.stockItem.findUnique({
        where: { id },
      });
      return stockItem ? mapToDomainStockItem(stockItem) : null;
    },

    findStockItemByName: async (
      itemName: string
    ): Promise<StockItem | null> => {
      const stockItem = await prismaStockRepository.stockItem.findUnique({
        where: { itemName },
      });
      return stockItem ? mapToDomainStockItem(stockItem) : null;
    },

    getAllStockItems: async (): Promise<StockItem[]> => {
      const stockItems = await prismaStockRepository.stockItem.findMany();
      return stockItems.map((stockItem) => mapToDomainStockItem(stockItem));
    },
  };
};

const stockItemRepositoryDb = createStockItemRepositoryDb(prisma);

export default stockItemRepositoryDb;
