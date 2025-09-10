import { useQuery, useMutation, type UseMutationOptions } from '@tanstack/react-query'
import type dayjs from 'dayjs'
import type { Stock } from '../../api/entity'
import { useAxios } from '../../axios/axios'
import type { GetStockAllowance } from '../../entity'
import { useAddSnackbarMessage } from '../../hooks/useAddSnackBar'
import { queryClient } from '../../reactQuery/reactTanstackQuerySetup'
import { getStocks, postCreateNewStockItem, deleteStockItem, getStockItems, getStockAllowances } from './api'
import type { StockItemCreateData, ExistingStockItem } from './entity'

export const useStocksQuery = () => {
  const axios = useAxios()

  return useQuery<Stock[]>({
    queryKey: ['stocks'],
    queryFn: () => getStocks(axios),
  })
}

export const useCreateOrUpdateStockItemMutation = (
  options?: UseMutationOptions<StockItemCreateData, unknown, StockItemCreateData>
) => {
  const axios = useAxios()
  const addSnackBarMessage = useAddSnackbarMessage()

  return useMutation<StockItemCreateData, Error, StockItemCreateData>({
    mutationFn: (stockItem: StockItemCreateData) => postCreateNewStockItem(axios, stockItem),
    onSuccess(data, variables, context) {
      options?.onSuccess?.(data, variables, context)
      queryClient.invalidateQueries({ queryKey: ['stockItems'] })
      addSnackBarMessage({ text: 'Materiál úspěšně přidán/upraven.', type: 'success' })
    },
    onError: (error) => {
      addSnackBarMessage({ text: error.message, type: 'error' })
    },
  })
}
export const useDeleteStockItemMutation = (options?: UseMutationOptions<void, unknown, string>) => {
  const axios = useAxios()
  const addSnackBarMessage = useAddSnackbarMessage()

  return useMutation({
    mutationFn: (stockItemId: string) => deleteStockItem(axios, stockItemId),
    onSuccess(data, variables, context) {
      options?.onSuccess?.(data, variables, context)
      queryClient.invalidateQueries({ queryKey: ['stockItems'] })
      addSnackBarMessage({ text: 'Materiál úspěšně smazán.', type: 'success' })
    },
    onError: (error) => {
      addSnackBarMessage({ text: 'Materiál se nepodařilo smazat.', type: 'error' })
      console.error(error)
    },
  })
}

export const useStockItemsQuery = (stockId: string | undefined) => {
  const axios = useAxios()

  return useQuery<ExistingStockItem[]>({
    queryKey: ['stockItems', stockId],
    queryFn: () => {
      if (!stockId) {
        throw new Error('Stock ID is required to fetch stock items.')
      }
      return getStockItems(axios, stockId)
    },
  })
}
export const useStockAllowancesQuery = ({
  teamId,
  fromDate,
  toDate,
}: {
  teamId: string | undefined
  fromDate: dayjs.Dayjs
  toDate: dayjs.Dayjs
}) => {
  const axios = useAxios()

  return useQuery<GetStockAllowance[]>({
    queryKey: ['stockAllowances', teamId, fromDate, toDate],
    queryFn: () => {
      if (!teamId) {
        throw new Error('Chybí týmové ID.')
      }
      return getStockAllowances(axios, { teamId, fromDate, toDate })
    },
  })
}
