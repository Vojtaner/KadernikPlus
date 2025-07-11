import { useQuery } from '@tanstack/react-query'
import type { UserLog, WareHouseItemStateType } from './api/entity'
import { useAxios } from './axios/axios'
import { http, HttpResponse, type PathParams } from 'msw'
import { mockUserLogs } from './api/mocks'
import { apiRoutes } from './api/apiRoutes'
import { getStockItems, getUserLogs } from './api/api'

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
