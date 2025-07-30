import { useQuery, type UseMutationOptions } from '@tanstack/react-query'
import type { Stock, UserLog } from './api/entity'
import { http, HttpResponse, type PathParams } from 'msw'
import { mockUserLogs } from './api/mocks'

import { apiRoutes } from './api/apiRoutes'
import {
  deleteTeamMember,
  getClientById,
  getClients,
  getProcedures,
  getServices,
  getStockItems,
  getStocks,
  getTeamMember,
  getTeamMembers,
  getUserLogs,
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
} from '../../entities/client'
import type { StockItemCreateData } from '../../entities/stock-item'
import type { Service, ServiceCreateData } from '../../entities/service'
import { type StockItem } from '../../entities/stock-item'
import { queryClient } from './reactQuery/reactTanstackQuerySetup'
import type { VisitWithServices, VisitCreateData, VisitDetailFormType } from '../../entities/visit'
import { DEFAULT_USERS_TEAM, type TeamMember } from '../../entities/team-member'
import type { CreateProcedure, PostNewProcedure } from '../../entities/procedure'
import type { Dayjs } from 'dayjs'
import type { AxiosError } from 'axios'

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

  return useMutation({
    mutationFn: (data: { email: string; consentId: string }) => postInviteTeamMember(axios, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] })
    },
  })
}
export const useDeleteTeamMemberMutation = () => {
  const axios = useAxios()

  return useMutation({
    mutationFn: (id: string) => deleteTeamMember(axios, id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] })
    },
  })
}

export const useUpdateTeamMemberSkill = (teamId?: string) => {
  const axios = useAxios()

  return useMutation({
    mutationFn: (data: SkillUpdateInput) => {
      if (!teamId) {
        throw new Error('Team ID not found.')
      }
      return patchTeamMemberSkill(axios, data, teamId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teamMembers'] })
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

  const mutation = useMutation({
    mutationFn: (data: PostNewProcedure) => postNewProcedure(axios, data.visitId, data),

    onSuccess: (data: CreateProcedure, variables, context) => {
      options?.onSuccess?.(data, variables, context)
      queryClient.invalidateQueries({ queryKey: ['procedures', data.visitId] })
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

  return useMutation<ServiceCreateData, Error, ServiceCreateData>({
    mutationFn: (serviceData: ServiceCreateData) => postCreateService(axios, serviceData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['services'] })
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

  return useMutation<VisitCreateData, Error, VisitCreateData>({
    mutationFn: (visitData: VisitCreateData) => postCreateVisit(axios, visitData),
    onSuccess: (visitData, variables, context) => {
      options?.onSuccess?.(visitData, variables, context)
      queryClient.invalidateQueries({ queryKey: ['visits'] })
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['client', visitData.clientId] })
    },
  })
}

export const useVisitStatusMutation = () => {
  const axios = useAxios()

  return useMutation<{ visitId?: string; status: boolean }, Error, { visitId?: string; status: boolean } | undefined>({
    mutationFn: async (data) => {
      if (!data || !data.visitId) {
        throw Error('Data for visit status update are not complete')
      }

      await patchUpdateVisitStatus(axios, data)
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['visit', data.visitId] })
      queryClient.invalidateQueries({ queryKey: ['visits'] })
    },
  })
}

export const useUpdateVisitMutation = (visitId: string | undefined) => {
  const axios = useAxios()

  return useMutation<string, Error, VisitDetailFormType>({
    mutationFn: async (visitData: VisitDetailFormType) => {
      if (!visitId) {
        throw new Error('Visit ID is required to update a visit.')
      }

      await patchUpdateVisit(axios, visitId, visitData)
      return visitId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visit', visitId] })
      queryClient.invalidateQueries({ queryKey: ['visits'] })
    },
  })
}

export const useVisitsQuery = (query?: { from?: Dayjs; to?: Dayjs }) => {
  const axios = useAxios()

  return useQuery<VisitWithServices[]>({
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

// export const useClientDepositStatusMutation = () => {
//   const axios = useAxios()

//   return useMutation<{ visitId?: string; status: boolean }, Error, { visitId?: string; status: boolean } | undefined>({
//     mutationFn: async (data) => {
//       if (!data || !data.visitId) {
//         throw Error('Data for visit status update are not complete')
//       }

//       await patchUpdateVisitStatus(axios, data)
//       return data
//     },
//     onSuccess: (data) => {
//       queryClient.invalidateQueries({ queryKey: ['visit', data.visitId] })
//       queryClient.invalidateQueries({ queryKey: ['visits'] })
//     },
//   })
// }

export const useCreateNewOrUpdateClientMutation = (): UseMutationResult<
  ClientOrUpdateCreateData,
  Error,
  ClientOrUpdateCreateData
> => {
  const axios = useAxios()

  return useMutation<ClientOrUpdateCreateData, Error, ClientOrUpdateCreateData>({
    mutationFn: (clientData: ClientOrUpdateCreateData) => postCreateNewClient(axios, clientData),
    onSuccess: (client) => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['client', client.id] })
    },
  })
}

export const useSearchClientsQuery = (payload: ClientSearchPayload, enabled = true) => {
  const axios = useAxios()

  return useQuery<ClientWithVisitsWithVisitServices[], Error>({
    queryKey: ['searchClients'],
    queryFn: () => patchSearchClients(axios, payload),
    enabled: enabled && !!payload.nameOrPhone, // only search if query string is present and enabled is true
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
        throw Error('Client ID is missing.')
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

  return useMutation<StockItemCreateData, Error, StockItemCreateData>({
    mutationFn: (stockItem: StockItemCreateData) => postCreateNewStockItem(axios, stockItem),
    onSuccess(data, variables, context) {
      options?.onSuccess?.(data, variables, context)
      queryClient.invalidateQueries({ queryKey: ['stockItems'] })
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

export const useUserLogsQuery = (userId: string) => {
  const axios = useAxios()

  return useQuery<UserLog[]>({
    queryKey: ['userLogs', userId],
    queryFn: () => getUserLogs(axios, userId),
    enabled: !!userId,
  })
}
