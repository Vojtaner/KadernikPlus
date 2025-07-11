import { http, HttpResponse, type PathParams } from 'msw'
import type { UserLog, UserType, WareHouseItemStateType } from './entity'
import { mockUserLogs, mockUser, mockWarehouseState } from './mocks'
import type { AxiosInstance } from 'axios'
import { apiRoutes } from './apiRoutes'

export const mockGetUser = () =>
  http.get<object, PathParams<string>, UserType>('todos/1', () => {
    return HttpResponse.json(mockUser)
  })

export const mockGetWareHouseItems = () =>
  http.get('/api/user/warehouse', () => {
    return HttpResponse.json(mockWarehouseState)
  })

export const mockGetUserLogs = () =>
  http.get<object, PathParams<string>, UserLog[]>(apiRoutes.getUserLogsUrl('unique-user-1'), () => {
    return HttpResponse.json(mockUserLogs)
  })

export const getUser = async (axios: AxiosInstance) => {
  const { data: userData } = await axios.get(apiRoutes.getUserUrl('unique-user-1'))
  return userData
}

export const getUserLogs = async (axios: AxiosInstance, userId: string): Promise<UserLog[]> => {
  const response = await axios.get(apiRoutes.getUserLogsUrl(userId))
  return response.data
}

export const getStockItems = async (axios: AxiosInstance): Promise<WareHouseItemStateType[]> => {
  const response = await axios.get(apiRoutes.getStockItemsUrl())
  return response.data
}
