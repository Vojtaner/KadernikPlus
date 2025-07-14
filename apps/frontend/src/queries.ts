import { useQuery } from '@tanstack/react-query'
import type { UserLog, WareHouseItemStateType } from './api/entity'
import { http, HttpResponse, type PathParams } from 'msw'
import { mockUserLogs } from './api/mocks'
import { apiRoutes } from './api/apiRoutes'
import { getStockItems, getUserLogs, postCreateNewClient, postCreateNewStockItem } from './api/api'

import { type UseMutationResult, useMutation } from '@tanstack/react-query'
import { useAxios } from './axios/axios'
import type { ClientCreateData } from '../../entities/client'
import type { StockItemCreateData } from '../../entities/stock-item'

export const useCreateNewClientMutation = (): UseMutationResult<ClientCreateData, Error, ClientCreateData> => {
  const axios = useAxios()

  return useMutation<ClientCreateData, Error, ClientCreateData>({
    mutationFn: (clientData: ClientCreateData) => postCreateNewClient(axios, clientData),
  })
}

export const useCreateStockItemMutation = (): UseMutationResult<StockItemCreateData, Error, StockItemCreateData> => {
  const axios = useAxios()

  return useMutation<StockItemCreateData, Error, StockItemCreateData>({
    mutationFn: (stockItem: StockItemCreateData) => postCreateNewStockItem(axios, stockItem),
  })
}

export const useUserLogsQuery = (userId: string) => {
  const axios = useAxios()

  return useQuery<UserLog[]>({
    queryKey: ['userLogs', userId],
    queryFn: () => getUserLogs(axios, userId),
    enabled: !!userId,
  })
}

export const mockGetUserLogs = () =>
  http.get<object, PathParams<string>, UserLog[]>(apiRoutes.getUserLogsUrl('unique-user-1'), () => {
    return HttpResponse.json(mockUserLogs)
  })

export const useWareHouseQuery = () => {
  const axios = useAxios()

  return useQuery<WareHouseItemStateType[]>({
    queryKey: ['warehouse'],
    queryFn: () => getStockItems(axios),
  })
}
