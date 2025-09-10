import type { Stock } from '../../api/entity'
import { queryClient } from '../../reactQuery/reactTanstackQuerySetup'
import type { AddProcedureStockAllowanceType } from './components/AddProcedureButton'

export const mapDefaultStockAlowances = (
  defaultStockAllowances?: AddProcedureStockAllowanceType
): { stockItemId: string; quantity: number; id: string }[] => {
  if (!defaultStockAllowances) {
    return []
  }

  return defaultStockAllowances.map((stockAllowance) => ({
    stockItemId: stockAllowance.stockItemId,
    quantity: Number(stockAllowance.quantity),
    id: stockAllowance.id ?? '',
  }))
}

export const getProcedureInvalidation = (stocks: Stock[] | undefined, visitId: string | undefined) => {
  queryClient.invalidateQueries({ queryKey: ['stockItems'] })
  queryClient.invalidateQueries({ queryKey: ['procedures', visitId] })
  queryClient.invalidateQueries({ queryKey: ['visit', visitId] })
  queryClient.invalidateQueries({ queryKey: ['stockItems', stocks && stocks[0].id] })
}
