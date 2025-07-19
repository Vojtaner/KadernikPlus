import { http, HttpResponse, type PathParams } from 'msw'
import type { Stock, UserLog, UserType } from './entity'
import { mockUserLogs, mockUser, mockWarehouseState } from './mocks'
import type { AxiosInstance } from 'axios'
import { apiRoutes } from './apiRoutes'
import type { Client, ClientCreateData } from '../../../entities/client'
import type { StockItemCreateData } from '../../../entities/stock-item'
import { type StockItem } from '../../../entities/stock-item'
import type { Service, ServiceCreateData } from '../../../entities/service'
import type { GetVisitsType, VisitCreateData, VisitDetailFormType } from '../../../entities/visit'
import type { TeamMember } from '../../../entities/team-member'
import type { VisitDetailForm } from '../reactHookForm/entity'
import type { User } from '@auth0/auth0-react'

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

export const getStockItems = async (axios: AxiosInstance, stockId: string): Promise<StockItem[]> => {
  const response = await axios.get(apiRoutes.getStockItemsUrl(stockId))
  return response.data
}

export const getServices = async (axios: AxiosInstance): Promise<Service[]> => {
  const response = await axios.get(apiRoutes.getServiceUrl())
  return response.data
}
export const getVisitByVisitId = async (axios: AxiosInstance, visitId: string): Promise<GetVisitsType> => {
  const response = await axios.get(apiRoutes.getVisitByVisitIdUrl(visitId))
  return response.data
}

export const getStocks = async (axios: AxiosInstance): Promise<Stock[]> => {
  const response = await axios.get(apiRoutes.getStocksUrl())
  return response.data
}

export const getClientById = async (axios: AxiosInstance, clientId: string): Promise<Client[]> => {
  const response = await axios.get(apiRoutes.getClientByIdUrl(clientId))
  return response.data
}
export const getClients = async (axios: AxiosInstance): Promise<Client[]> => {
  const response = await axios.get(apiRoutes.getClientsUrl())
  return response.data
}
export const getVisits = async (axios: AxiosInstance): Promise<GetVisitsType[]> => {
  const response = await axios.get(apiRoutes.getVisitUrl())
  return response.data
}

export const postCreateNewClient = async (
  axios: AxiosInstance,
  clientData: ClientCreateData
): Promise<ClientCreateData> => {
  const response = await axios.post(apiRoutes.getCreateNewClientUrl(), clientData)
  return response.data
}

export const postCreateService = async (
  axios: AxiosInstance,
  serviceData: ServiceCreateData
): Promise<ServiceCreateData> => {
  const response = await axios.post(apiRoutes.getServiceUrl(), serviceData)
  return response.data
}
export const postCreateVisit = async (axios: AxiosInstance, visitData: VisitCreateData): Promise<VisitCreateData> => {
  const response = await axios.post(apiRoutes.getVisitUrl(), visitData)
  return response.data
}
export const patchUpdateVisit = async (
  axios: AxiosInstance,
  visitId: string,
  visitData: VisitDetailFormType
): Promise<VisitDetailForm> => {
  const response = await axios.patch(apiRoutes.getUpdateVisitUrl(visitId), visitData)
  return response.data
}

export const postCreateNewStockItem = async (
  axios: AxiosInstance,
  stockItem: StockItemCreateData
): Promise<StockItemCreateData> => {
  const response = await axios.post(apiRoutes.getCreateStockItemUrl(), stockItem)
  return response.data
}

export const getTeamMembers = async (
  axios: AxiosInstance,
  teamId: string
): Promise<(TeamMember & { user: { name: string } })[]> => {
  const response = await axios.get(apiRoutes.getTeamMembersUrl(teamId))
  return response.data
}
export const getTeamMember = async (axios: AxiosInstance): Promise<TeamMember> => {
  const response = await axios.get(apiRoutes.getTeamMemberUrl())
  return response.data
}

export const getTeam = async (axios: AxiosInstance): Promise<User[]> => {
  const response = await axios.get(apiRoutes.getTeamUrl())
  return response.data
}
