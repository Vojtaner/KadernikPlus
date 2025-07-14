import { http, HttpResponse, type PathParams } from 'msw'
import type { UserLog, UserType, WareHouseItemStateType } from './entity'
import { mockUserLogs, mockUser, mockWarehouseState } from './mocks'
import type { AxiosInstance } from 'axios'
import { apiRoutes } from './apiRoutes'
import type { ClientCreateData } from '../../../entities/client'
import type { StockItemCreateData } from '../../../entities/stock-item'

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

export const getClientById = async (axios: AxiosInstance, clientId: string): Promise<WareHouseItemStateType[]> => {
  const response = await axios.get(apiRoutes.getClientByIdUrl(clientId))
  return response.data
}

export const postCreateNewClient = async (
  axios: AxiosInstance,
  clientData: ClientCreateData
): Promise<ClientCreateData> => {
  const response = await axios.post(apiRoutes.getCreateNewClientUrl(), clientData)
  return response.data
}

export const postCreateNewStockItem = async (
  axios: AxiosInstance,
  stockItem: StockItemCreateData
): Promise<StockItemCreateData> => {
  const response = await axios.post(apiRoutes.getCreateStockItemUrl(), stockItem)
  return response.data
}
