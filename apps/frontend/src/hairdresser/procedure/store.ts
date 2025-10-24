import { mapStocksStockItemsToFlatStockItems } from '../stock/entity';
import { useStockItemsQuery } from '../stock/queries';
import type { AddProcedureStockAllowanceType } from './components/AddProcedureButton';

export const useEditableAndReadonlyStockAllowances = (
  stockAllowances: AddProcedureStockAllowanceType | undefined,
) => {
  const { data: stocksWithStockItems } = useStockItemsQuery(undefined);
  const stockItems = mapStocksStockItemsToFlatStockItems(stocksWithStockItems);

  if (!stockItems?.length) {
    return { editableAllowances: [], readonlyAllowances: stockAllowances ?? [] };
  }

  const stockItemIds = new Set(stockItems.map(item => item.id));

  const editableAllowances =
    stockAllowances?.filter(stockAllowance => stockItemIds.has(stockAllowance.stockItemId)) || [];
  const readonlyAllowances =
    stockAllowances?.filter(stockAllowance => !stockItemIds.has(stockAllowance.stockItemId)) || [];

  return { editableAllowances, readonlyAllowances };
};
