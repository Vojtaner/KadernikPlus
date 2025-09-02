import { StockItemBuyData, StockItemCreateData } from "@/entities/stock-item";
import { StockItemRepositoryPort } from "../../ports/stock-item-repository";
import stockItemRepositoryDb from "../../../infrastructure/data/prisma/prisma-stock-item-repository";
import { isNewStockItem } from "../../../infrastructure/controllers/stock-item-controller";
import { StockItem } from "@prisma/client";
import { httpError } from "../../../adapters/express/httpError";

const createOrUpdateCreateStockItemUseCase = (dependencies: {
  stockItemRepositoryDb: StockItemRepositoryPort;
}) => {
  return {
    execute: async (
      data: StockItemCreateData | StockItemBuyData
    ): Promise<StockItem | undefined> => {
      if (isNewStockItem(data)) {
        if (!data.itemName || data.itemName.trim() === "") {
          throw httpError("Název skladové položky nesmí být prázdný.", 422);
        }
        if (!data.unit || data.unit.trim() === "") {
          throw httpError("Jednotka skladové položky nesmí být prázdná.", 422);
        }
        if (data.quantity < 0) {
          throw httpError("Množství skladové položky nesmí být záporné.", 400);
        }
        if (data.threshold < 0) {
          throw httpError("Práh skladové položky nesmí být záporný.", 400);
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
