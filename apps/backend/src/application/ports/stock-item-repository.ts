import {
  StockItem,
  StockItemBuyData,
  StockItemCreateData,
} from "@/entities/stock-item";

export type StockItemRepositoryPort = {
  createOrUpdateStockItem(
    data: StockItemCreateData | StockItemBuyData
  ): Promise<StockItem | undefined>;
  getStockItemById(stockItemId: string): Promise<StockItem | null>;
  findStockItemByName(name: string): Promise<StockItem | null>;
  getStockItemsByStockId(stockId: string): Promise<StockItem[]>;
};
