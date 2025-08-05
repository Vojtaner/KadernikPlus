import { useQuery, type UseMutationOptions } from '@tanstack/react-query'
import type { Stock, UserLog } from './api/entity'
import { http, HttpResponse, type PathParams } from 'msw'
import { mockUserLogs } from './api/mocks'

import { apiRoutes } from './api/apiRoutes'
import {
  deleteStockItem,
  deleteTeamMember,
  getClientById,
  getClients,
  getLogs,
  getProcedures,
  getServices,
  getStockItems,
  getStocks,
  getTeamMember,
  getTeamMembers,
  getVisitByVisitId,
  getVisits,
  patchSearchClients,
  patchTeamMemberSkill,
  patchUpdateVisit,
  patchUpdateVisitStatus,
  postCreateNewClient,
  postCreateNewStockItem,
  postCreateService,
  postCreateVisit,
  postInviteTeamMember,
  postNewProcedure,
} from './api/api'

import { type UseMutationResult, useMutation } from '@tanstack/react-query'
import { useAxios } from './axios/axios'
import type {
  Client,
  ClientOrUpdateCreateData,
  ClientSearchPayload,
  ClientWithVisits,
  ClientWithVisitsWithVisitServices,
} from './entities/client'
import type { StockItemCreateData } from './entities/stock-item'
import type { Service, ServiceCreateData } from './entities/service'
import { type StockItem } from './entities/stock-item'
import { queryClient } from './reactQuery/reactTanstackQuerySetup'
import type {
  VisitWithServices,
  VisitCreateData,
  VisitDetailFormType,
  VisitWithServicesWithProceduresWithStockAllowances,
} from './entities/visit'
import { DEFAULT_USERS_TEAM, type TeamMember } from './entities/team-member'
import type { CreateProcedure, PostNewProcedure } from './entities/procedure'
import type { Dayjs } from 'dayjs'
import type { AxiosError } from 'axios'
import type { LogData } from './entities/logs'
import { useAddSnackbarMessage } from './hooks/useAddSnackBar'

// ---- Team and TeamMembers ----
export const useTeamMemberQuery = () => {
  const axios = useAxios()

  return useQuery<TeamMember>({
    queryKey: ['teamMember'],
    queryFn: () => getTeamMember(axios),
  })
}

export type SkillUpdateInput = {
  memberId: string
  canAccessStocks: boolean
  canAccessClients: boolean
  canAccessVisits: boolean
}

export const useAddTeamMemberMutation = () => {
  const axios = useAxios()
  const addSnackBarMessage = useAddSnackbarMessage()

  return useMutation({
    mutationFn: (data: { email: string; consentId: string }) => postInviteTeamMember(axios, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] })
      addSnackBarMessage({ text: 'Člen týmu byl přidán.', type: 'success' })
    },
    onError: (error) => {
      addSnackBarMessage({ text: error.message, type: 'error' })
    },
  })
}

export const useDeleteTeamMemberMutation = () => {
  const axios = useAxios()
  const addSnackBarMessage = useAddSnackbarMessage()

  return useMutation({
    mutationFn: (id: string) => deleteTeamMember(axios, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] })
      addSnackBarMessage({ text: 'Člen týmu byl odebrán.', type: 'success' })
    },
    onError: (error) => {
      addSnackBarMessage({ text: 'Nepovedlo se odebrat člena týmu.', type: 'error' })
      console.error(error)
    },
  })
}

export const useUpdateTeamMemberSkill = (teamId?: string) => {
  const axios = useAxios()
  const addSnackBarMessage = useAddSnackbarMessage()

  return useMutation({
    mutationFn: (data: SkillUpdateInput) => {
      if (!teamId) {
        throw new Error('Team ID not found.')
      }
      return patchTeamMemberSkill(axios, data, teamId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] })
      addSnackBarMessage({ text: 'Oprávnění byla v týmu byla upravena.', type: 'success' })
    },
    onError: (error) => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] })
      addSnackBarMessage({ text: 'Oprávnění v týmu se nepodařilo upravit.', type: 'error' })
      console.error(error)
    },
  })
}

export const useTeamMembersQuery = (teamId?: string) => {
  const axios = useAxios()

  const resolvedTeamId = teamId || DEFAULT_USERS_TEAM

  return useQuery<(TeamMember & { user: { name: string } })[]>({
    queryKey: ['teamMembers', resolvedTeamId],
    queryFn: () => getTeamMembers(axios, resolvedTeamId),
  })
}

// ---- Procedures ----
export const useProceduresQuery = (visitId: string | undefined) => {
  const axios = useAxios()

  return useQuery<CreateProcedure[]>({
    queryKey: ['procedures', visitId],
    queryFn: () => {
      if (!visitId) {
        throw new Error('Stock ID is required to fetch stock items.')
      }
      const procedures = getProcedures(axios, visitId)

      return procedures
    },
  })
}

export const useProceduresMutation = (options?: UseMutationOptions<CreateProcedure, unknown, PostNewProcedure>) => {
  const axios = useAxios()
  const addSnackBarMessage = useAddSnackbarMessage()

  const mutation = useMutation({
    mutationFn: (data: PostNewProcedure) => postNewProcedure(axios, data.visitId, data),

    onSuccess: (data: CreateProcedure, variables, context) => {
      options?.onSuccess?.(data, variables, context)
      queryClient.invalidateQueries({ queryKey: ['procedures', data.visitId] })
      queryClient.invalidateQueries({ queryKey: ['stockItems'] })
      addSnackBarMessage({ text: 'Procedura byla upravena.', type: 'success' })
    },
    onError: (error) => {
      addSnackBarMessage({ text: 'Proceduru se nepovedlo upravit.', type: 'error' })
      console.error(error)
    },
  })

  return { mutation }
}

// ---- Services ----
export const useServicesQuery = () => {
  const axios = useAxios()

  return useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: () => getServices(axios),
  })
}
export const useCreateServiceMutation = () => {
  const axios = useAxios()
  const addSnackBarMessage = useAddSnackbarMessage()

  return useMutation<ServiceCreateData, Error, ServiceCreateData>({
    mutationFn: (serviceData: ServiceCreateData) => postCreateService(axios, serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
      addSnackBarMessage({ text: 'Služba byla vytvořena a přidána do ceníku.', type: 'success' })
    },

    onError: (error) => {
      addSnackBarMessage({ text: 'Službu se nepovedlo vytvořit.', type: 'error' })
      console.error(error)
    },
  })
}

// ---- Visits ----
export const useVisitQuery = (visitId: string | undefined) => {
  const axios = useAxios()

  return useQuery<VisitWithServices>({
    queryKey: ['visit', visitId],
    queryFn: () => {
      if (!visitId) {
        throw new Error('Visit ID is required to fetch visits.')
      }

      return getVisitByVisitId(axios, visitId).then((data) => ({
        ...data,
        paidPrice: Number(data.paidPrice),
        deposit: Number(data.deposit),
      }))
    },
  })
}

export const useCreateVisitMutation = (options?: UseMutationOptions<VisitCreateData, Error, VisitCreateData>) => {
  const axios = useAxios()
  const addSnackBarMessage = useAddSnackbarMessage()

  return useMutation<VisitCreateData, Error, VisitCreateData>({
    mutationFn: (visitData: VisitCreateData) => postCreateVisit(axios, visitData),
    onSuccess: (visitData, variables, context) => {
      options?.onSuccess?.(visitData, variables, context)
      queryClient.invalidateQueries({ queryKey: ['visits'] })
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['client', visitData.clientId] })
      addSnackBarMessage({ text: 'Návštěva byla uložena.', type: 'success' })
    },
    onError: (error) => {
      addSnackBarMessage({ text: 'Návštěvu se nepodařilo byla uložit.', type: 'error' })
      console.error(error)
    },
  })
}

export const useVisitStatusMutation = () => {
  const axios = useAxios()
  const addSnackBarMessage = useAddSnackbarMessage()

  return useMutation<{ visitId?: string; status: boolean }, Error, { visitId?: string; status: boolean } | undefined>({
    mutationFn: async (data) => {
      if (!data || !data.visitId) {
        throw Error('Data pro úpravu návštěvy nejsou kompletní.')
      }

      await patchUpdateVisitStatus(axios, data)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['visit', data.visitId] })
      queryClient.invalidateQueries({ queryKey: ['visits'] })
      addSnackBarMessage({ text: 'Stav návštěvy byl upraven.', type: 'success' })
    },
    onError: (error) => {
      addSnackBarMessage({ text: 'Stav návštěvy nebyl upraven.', type: 'error' })
      console.error(error)
    },
  })
}

export const useUpdateVisitMutation = (visitId: string | undefined) => {
  const axios = useAxios()
  const addSnackBarMessage = useAddSnackbarMessage()

  return useMutation<string, Error, VisitDetailFormType>({
    mutationFn: async (visitData: VisitDetailFormType) => {
      if (!visitId) {
        throw new Error('Id návštěvy je nutné k její úpravě.')
      }

      await patchUpdateVisit(axios, visitId, visitData)
      return visitId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visit', visitId] })
      queryClient.invalidateQueries({ queryKey: ['visits'] })
      addSnackBarMessage({ text: 'Návštěva byla upravena.', type: 'success' })
    },
    onError: (error) => {
      addSnackBarMessage({ text: 'Návštěvu se nepodařilo upravit.', type: 'error' })
      console.error(error)
    },
  })
}

export const useVisitsQuery = (query?: { from?: Dayjs; to?: Dayjs }) => {
  const axios = useAxios()

  return useQuery<VisitWithServicesWithProceduresWithStockAllowances[]>({
    queryKey: query
      ? ['visits', query?.from?.format('YYYY-MM-DD') ?? null, query?.to?.format('YYYY-MM-DD') ?? null]
      : ['visits'],
    queryFn: () => {
      return getVisits(axios, query)
    },
    staleTime: 24 * 60 * 60 * 1000,
    refetchOnWindowFocus: false,
    refetchOnMount: true,
  })
}

// ---- Clients----

export const useCreateNewOrUpdateClientMutation = (): UseMutationResult<
  ClientOrUpdateCreateData,
  Error,
  ClientOrUpdateCreateData
> => {
  const axios = useAxios()
  const addSnackBarMessage = useAddSnackbarMessage()

  return useMutation<ClientOrUpdateCreateData, Error, ClientOrUpdateCreateData>({
    mutationFn: (clientData: ClientOrUpdateCreateData) => postCreateNewClient(axios, clientData),
    onSuccess: (client) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['logs'] })
      queryClient.invalidateQueries({ queryKey: ['client', client.id] })
      addSnackBarMessage({ text: 'Klienta se podařilo přidat/upravit.', type: 'success' })
    },
    onError: (error) => {
      addSnackBarMessage({ text: 'Klienta se nepodařilo přidat/upravit.', type: 'error' })
      console.error(error)
    },
  })
}

export const useSearchClientsQuery = (payload: ClientSearchPayload, enabled = true) => {
  const axios = useAxios()

  return useQuery<ClientWithVisitsWithVisitServices[], Error>({
    queryKey: ['searchClients'],
    queryFn: () => patchSearchClients(axios, payload),
    enabled: enabled && !!payload.nameOrPhone,
  })
}

export const useClientsQuery = () => {
  const axios = useAxios()

  return useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: () => getClients(axios),
  })
}
export const useClientQuery = (clientId: string | undefined) => {
  const axios = useAxios()

  return useQuery<ClientWithVisits, AxiosError<{ error: string; status: number }>>({
    queryKey: ['client', clientId],
    queryFn: () => {
      if (!clientId) {
        throw Error('Chybí ID klienta.')
      }

      const client = getClientById(axios, clientId)

      return client
    },
  })
}

// ---- Stock ----
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

  return useQuery<StockItem[]>({
    queryKey: ['stockItems', stockId],
    queryFn: () => {
      if (!stockId) {
        throw new Error('Stock ID is required to fetch stock items.')
      }
      return getStockItems(axios, stockId)
    },
  })
}

// ---- Others ----

export const mockGetUserLogs = () =>
  http.get<object, PathParams<string>, UserLog[]>(apiRoutes.getUserLogsUrl('unique-user-1'), () => {
    return HttpResponse.json(mockUserLogs)
  })

export const useLogsQuery = () => {
  const axios = useAxios()

  return useQuery<LogData[]>({
    queryKey: ['logs'],
    queryFn: () => {
      return getLogs(axios)
    },
  })
}
