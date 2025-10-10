import { StockItemBuyData, StockItemCreateData } from "@/entities/stock-item";
import {
  StockItemOperation,
  StockItemRepositoryPort,
  StockItemWithOperation,
} from "../../ports/stock-item-repository";
import stockItemRepositoryDb from "../../../infrastructure/data/prisma/prisma-stock-item-repository";
import { isNewStockItem } from "../../../infrastructure/controllers/stock-item-controller";
import { httpError } from "../../../adapters/express/httpError";
import { LogRepositoryPort } from "../../../application/ports/log-repository";
import { TeamMemberRepositoryPort } from "../../..//application/ports/team-member-repository";
import logRepositoryDb, {
  LogData,
} from "../../../infrastructure/data/prisma/prisma-log-repository";
import teamMemberRepositoryDb from "../../../infrastructure/data/prisma/prisma-team-member-repository";

const createOrUpdateCreateStockItemUseCase = (dependencies: {
  stockItemRepositoryDb: StockItemRepositoryPort;
  logRepositoryDb: LogRepositoryPort;
  teamMemberRepositoryDb: TeamMemberRepositoryPort;
}) => {
  return {
    execute: async (
      data: StockItemCreateData | StockItemBuyData,
      userId: string
    ): Promise<StockItemWithOperation | undefined> => {
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

      const stockItemOperation =
        await dependencies.stockItemRepositoryDb.createOrUpdateStockItem(data);

      const teamMember =
        await dependencies.teamMemberRepositoryDb.findUniqueMember(userId);

      if (!teamMember) {
        throw httpError("Nepodařilo se najít váš tým.", 404);
      }

      if (stockItemOperation) {
        const log = getStockItemLog(
          stockItemOperation,
          teamMember.teamId,
          userId,
          data
        );

        await dependencies.logRepositoryDb.log(log);
      }

      return stockItemOperation;
    },
  };
};

export type CreateOrUpdateStockItemUseCaseType = ReturnType<
  typeof createOrUpdateCreateStockItemUseCase
>;

const createOrUpdateStockItemUseCase = createOrUpdateCreateStockItemUseCase({
  stockItemRepositoryDb,
  logRepositoryDb,
  teamMemberRepositoryDb,
});

export default createOrUpdateStockItemUseCase;

const getStockItemMessage = (
  stockItemWithOperation: StockItemWithOperation,
  data: StockItemCreateData | StockItemBuyData
): string => {
  if (stockItemWithOperation.operation === StockItemOperation.PURCHASE) {
    return `NAKOUPENO ${stockItemWithOperation.activeName}, množství: ${data.quantity}, balení: ${data.packageCount} ks, cena celkem: ${stockItemWithOperation.totalPrice}`;
  } else if (stockItemWithOperation.operation === StockItemOperation.UPDATE) {
    return `UPRAVENA položka ${stockItemWithOperation.activeName}, množství: ${data.quantity}, balení: ${data.packageCount} ks, cena celkem: ${stockItemWithOperation.totalPrice}, jednotka: ${stockItemWithOperation.unit}, min. množství: ${stockItemWithOperation.threshold}`;
  }

  return `VYTVOŘENA položka ${stockItemWithOperation.activeName}, množství: ${data.quantity}, balení: ${data.packageCount} ks, cena celkem: ${stockItemWithOperation.totalPrice}, jednotka: ${stockItemWithOperation.unit}, min. množství: ${stockItemWithOperation.threshold}`;
};

const getStockItemLog = (
  stockItemWithOperation: StockItemWithOperation,
  teamId: string,
  userId: string,
  data: StockItemCreateData | StockItemBuyData
): LogData => {
  return {
    teamId: teamId,
    userId: userId,
    metadata: { input: stockItemWithOperation },
    entityId: stockItemWithOperation?.id,
    entityType: "stockItem",
    action: stockItemWithOperation.operation,
    message: getStockItemMessage(stockItemWithOperation, data),
  };
};
