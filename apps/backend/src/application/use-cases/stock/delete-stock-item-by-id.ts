import { StockItemRepositoryPort } from "../../ports/stock-item-repository";
import stockItemRepositoryDb from "../../../infrastructure/data/prisma/prisma-stock-item-repository";

const createDeleteStockItemByIdUseCase = (dependencies: {
  stockItemRepositoryDb: StockItemRepositoryPort;
}) => {
  return {
    execute: async (stockItemId: string, userId: string): Promise<void> => {
      if (!stockItemId || stockItemId.trim() === "") {
        throw new Error("Chybí ID položky.");
      }

      return dependencies.stockItemRepositoryDb.deleteStockItem(
        stockItemId,
        userId
      );
    },
  };
};

export type DeleteStockItemByIdUseCaseType = ReturnType<
  typeof createDeleteStockItemByIdUseCase
>;
const deleteStockItemByIdUseCase = createDeleteStockItemByIdUseCase({
  stockItemRepositoryDb,
});
export default deleteStockItemByIdUseCase;
