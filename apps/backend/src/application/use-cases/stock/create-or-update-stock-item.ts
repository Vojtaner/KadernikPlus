import { StockItemBuyData, StockItemCreateData } from "@/entities/stock-item";
import { StockItemRepositoryPort } from "../../ports/stock-item-repository";
import stockItemRepositoryDb from "../../../infrastructure/data/prisma/prisma-stock-item-repository";
import { isNewStockItem } from "../../../infrastructure/controllers/stock-item-controller";
import { StockItem } from "@prisma/client";

const createOrUpdateCreateStockItemUseCase = (dependencies: {
  stockItemRepositoryDb: StockItemRepositoryPort;
}) => {
  return {
    execute: async (
      data: StockItemCreateData | StockItemBuyData
    ): Promise<StockItem | undefined> => {
      if (isNewStockItem(data)) {
        if (!data.itemName || data.itemName.trim() === "") {
          throw new Error("Název skladové položky nesmí být prázdný.");
        }
        if (!data.unit || data.unit.trim() === "") {
          throw new Error("Jednotka skladové položky nesmí být prázdná.");
        }
        if (data.quantity < 0) {
          throw new Error("Množství skladové položky nesmí být záporné.");
        }
        if (data.threshold < 0) {
          throw new Error("Práh skladové položky nesmí být záporný.");
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
