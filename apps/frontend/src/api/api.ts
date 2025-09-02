import type { Stock, UserLog } from './entity'
import type { AxiosInstance } from 'axios'
import { apiRoutes } from './apiRoutes'
import type {
  Client,
  ClientOrUpdateCreateData,
  ClientSearchPayload,
  ClientWithVisits,
  ClientWithVisitsWithVisitServices,
} from '../entities/client'
import type { ExistingStockItem, StockItemCreateData } from '../entities/stock-item'
import type { CreateProcedure, PostNewProcedure } from '../entities/procedure'
import type { LogData } from '../entities/logs'
import type { Service, ServiceCreateOrUpdateData } from '../entities/service'
import type {
  CreateVisitType,
  VisitDetailFormType,
  VisitWithServicesHotFix,
  VisitWithServicesWithProceduresWithStockAllowances,
} from '../entities/visit'
import type { TeamMember } from '../entities/team-member'
import type { VisitDetailForm } from '../reactHookForm/entity'
import type { User } from '@auth0/auth0-react'
import type { Dayjs } from 'dayjs'
import { extractErrorMessage } from './errorHandler'
import type dayjs from 'dayjs'
import type { Subscription, SubscriptionCreateData } from '../entities/subscription'
import type { GetStockAllowance } from '../entity'

export const getUser = async (axios: AxiosInstance) => {
  const { data: userData } = await axios.get(apiRoutes.getUserUrl('unique-user-1'))
  return userData
}

export const getUserLogs = async (axios: AxiosInstance, userId: string): Promise<UserLog[]> => {
  const response = await axios.get(apiRoutes.getUserLogsUrl(userId))
  return response.data
}

export const getStockItems = async (axios: AxiosInstance, stockId: string): Promise<ExistingStockItem[]> => {
  const response = await axios.get(apiRoutes.getStockItemsUrl(stockId))
  return response.data
}
export const getStockAllowances = async (
  axios: AxiosInstance,
  params: { teamId: string; fromDate: dayjs.Dayjs; toDate: dayjs.Dayjs }
): Promise<GetStockAllowance[]> => {
  const response = await axios.get(apiRoutes.getStockAllowancesUrl(params))
  return response.data
}

export const getLogs = async (axios: AxiosInstance): Promise<LogData[]> => {
  const response = await axios.get(apiRoutes.getLogsUrl())
  return response.data
}

export const deleteStockItem = async (axios: AxiosInstance, stockItemId: string): Promise<void> => {
  const response = await axios.delete(apiRoutes.deleteStockItemByIdUrl(stockItemId))
  return response.data
}

export const getServices = async (axios: AxiosInstance): Promise<Service[]> => {
  const response = await axios.get(apiRoutes.getServiceUrl())
  return response.data
}
export const getVisitByVisitId = async (axios: AxiosInstance, visitId: string): Promise<VisitWithServicesHotFix> => {
  const response = await axios.get(apiRoutes.getVisitByVisitIdUrl(visitId))
  return response.data
}

export const getStocks = async (axios: AxiosInstance): Promise<Stock[]> => {
  const response = await axios.get(apiRoutes.getStocksUrl())
  return response.data
}

export const getClientById = async (axios: AxiosInstance, clientId: string): Promise<ClientWithVisits> => {
  const response = await axios.get(apiRoutes.getClientByIdUrl(clientId))
  return response.data
}
export const getClients = async (axios: AxiosInstance): Promise<Client[]> => {
  const response = await axios.get(apiRoutes.getClientsUrl())
  return response.data
}

export const getVisits = async (
  axios: AxiosInstance,
  query?: { from?: Dayjs; to?: Dayjs },
  date?: Dayjs
): Promise<VisitWithServicesWithProceduresWithStockAllowances[]> => {
  const response = await axios.get(apiRoutes.getVisitUrl(date, query))
  return response.data
}
export const getClientVisits = async (
  axios: AxiosInstance,
  clientId: string
): Promise<VisitWithServicesWithProceduresWithStockAllowances[]> => {
  const response = await axios.get(apiRoutes.getClientVisits(clientId))
  return response.data
}

export const postCreateNewClient = async (
  axios: AxiosInstance,
  clientData: ClientOrUpdateCreateData
): Promise<ClientOrUpdateCreateData> => {
  try {
    const response = await axios.post(apiRoutes.getCreateNewClientUrl(), clientData)

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Klineta se nepodařilo vytvořit.'))
  }
}

export const postCreateOrUpdateService = async (
  axios: AxiosInstance,
  serviceData: ServiceCreateOrUpdateData
): Promise<Service> => {
  const response = await axios.post(apiRoutes.getServiceUrl(), serviceData)
  return response.data
}
export const postCreateVisit = async (axios: AxiosInstance, visitData: CreateVisitType): Promise<CreateVisitType> => {
  try {
    const response = await axios.post(apiRoutes.getVisitUrl(), visitData)

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Návštěvu se nepodařilo vytvořit.'))
  }
}

export const patchSearchClients = async (
  axios: AxiosInstance,
  payload: ClientSearchPayload
): Promise<ClientWithVisitsWithVisitServices[]> => {
  const response = await axios.patch(apiRoutes.getSearchClientsUrl(payload.nameOrPhone), payload)
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
export const patchTeamMemberSkill = async (
  axios: AxiosInstance,
  memberData: {
    canAccessStocks: boolean
    canAccessClients: boolean
    canAccessVisits: boolean
  },
  teamId: string
): Promise<VisitDetailForm> => {
  const response = await axios.patch(apiRoutes.getUpdateTeamMemberUrl(teamId), memberData)
  return response.data
}
export const patchUpdateVisitStatus = async (axios: AxiosInstance, data: { visitId?: string; status: boolean }) => {
  const response = await axios.patch(apiRoutes.getUpdateVisitStatusUrl(), data)
  return response.data
}

export const postCreateNewStockItem = async (
  axios: AxiosInstance,
  stockItem: StockItemCreateData
): Promise<StockItemCreateData> => {
  try {
    const response = await axios.post(apiRoutes.getCreateOrUpdateStockItemUrl(), stockItem)
    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Materiál se nepodařilo přidat/upravit.'))
  }
}

export const postCreateSubscription = async (
  axios: AxiosInstance,
  params: SubscriptionCreateData
): Promise<{
  code: number
  message: string
  transId: string
  redirect: string
}> => {
  try {
    const response = await axios.post(apiRoutes.postCreateSubscriptionUrl(), params)
    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Platbu se nepovedlo vytvořit.'))
  }
}

export const postInviteTeamMember = async (
  axios: AxiosInstance,
  data: { email: string; consentId: string }
): Promise<TeamMember> => {
  try {
    const response = await axios.post(apiRoutes.getInviteTeamMemberUrl(), data)
    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Nepovedlo se přidat člena týmu.'))
  }
}

export const deleteTeamMember = async (axios: AxiosInstance, id: string): Promise<TeamMember> => {
  const response = await axios.delete(apiRoutes.getTeamMemberUrl(), { data: { id } })
  return response.data
}
export const deleteVisit = async (axios: AxiosInstance, visitId: string): Promise<string> => {
  try {
    const response = await axios.delete(apiRoutes.getDeleteVisitUrl(visitId))
    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Nepovedlo se smazat návštěvu.'))
  }
}

export const getTeamMembers = async (
  axios: AxiosInstance,
  teamId: string
): Promise<(TeamMember & { user: { name: string } })[]> => {
  const response = await axios.get(apiRoutes.getTeamMembersUrl(teamId))
  return response.data
}

export const getProcedures = async (axios: AxiosInstance, visitId: string): Promise<CreateProcedure[]> => {
  const response = await axios.get(apiRoutes.getVisitProceduresUrl(visitId))
  return response.data
}
export const getSubscription = async (axios: AxiosInstance): Promise<Subscription> => {
  try {
    const response = await axios.get(apiRoutes.getSubscription())
    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Nepovedlo se načíst předplatné.'))
  }
}

export const postNewProcedure = async (
  axios: AxiosInstance,
  visitId: string,
  data: PostNewProcedure
): Promise<CreateProcedure> => {
  const response = await axios.post(apiRoutes.getVisitProceduresUrl(visitId), data)
  return response.data
}

export const deleteProcedure = async (axios: AxiosInstance, procedureId: string): Promise<string> => {
  const response = await axios.delete(apiRoutes.getProceduresUrl(procedureId))
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
