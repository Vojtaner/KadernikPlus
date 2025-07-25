import {
  StockItem,
  StockItemBuyData,
  StockItemCreateData,
} from "@/entities/stock-item";
import { StockItemRepositoryPort } from "../../ports/stock-item-repository";
import stockItemRepositoryDb from "../../../infrastructure/data/prisma/prisma-stock-item-repository";
import { isPurchaseStockItem } from "../../../infrastructure/controllers/stock-item-controller";

const createOrUpdateCreateStockItemUseCase = (dependencies: {
  stockItemRepositoryDb: StockItemRepositoryPort;
}) => {
  return {
    execute: async (
      data: StockItemCreateData | StockItemBuyData
    ): Promise<StockItem | undefined> => {
      if (!isPurchaseStockItem(data)) {
        if (!data.itemName || data.itemName.trim() === "") {
          throw new Error("Stock item name cannot be empty.");
        }
        if (!data.unit || data.unit.trim() === "") {
          throw new Error("Stock item unit cannot be empty.");
        }
        if (data.quantity < 0) {
          throw new Error("Stock item quantity cannot be negative.");
        }
        if (data.threshold < 0) {
          throw new Error("Stock item threshold cannot be negative.");
        }
      }

      const newOrUpdatedStockItem =
        await dependencies.stockItemRepositoryDb.createOrUpdateStockItem(data);

      return newOrUpdatedStockItem;
    },
  };
};

export type CreateOrUpdateStockItemUseCaseType = ReturnType<
  typeof createOrUpdateCreateStockItemUseCase
>;

const createOrUpdateStockItemUseCase = createOrUpdateCreateStockItemUseCase({
  stockItemRepositoryDb,
});

export default createOrUpdateStockItemUseCase;
