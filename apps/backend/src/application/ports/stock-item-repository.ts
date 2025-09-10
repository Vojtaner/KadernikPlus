import { StockItemBuyData, StockItemCreateData } from "@/entities/stock-item";
import { Prisma, Stock, StockItem } from "@prisma/client";

export type StockItemRepositoryPort = {
  createOrUpdateStockItem(
    data: StockItemCreateData | StockItemBuyData
  ): Promise<StockItem | undefined>;
  getStockItemById(
    stockItemId: string,
    userId: string
  ): Promise<StockItem | null>;
  deleteStockItem: (stockItemId: string, userId: string) => Promise<void>;
  deleteAll: (stockId: string) => Promise<Prisma.BatchPayload>;
  findStockItemByName(name: string): Promise<StockItem | null>;
  getStockItemsByStockId(stockId: string, userId: string): Promise<StockItem[]>;
  getStockItemsByStocks(stockIds: string[]): Promise<
    (Stock & {
      stockItems: StockItem[];
    })[]
  >;
};
