import { useQuery } from '@tanstack/react-query'
import type { Stock, UserLog } from './api/entity'
import { http, HttpResponse, type PathParams } from 'msw'
import { mockUserLogs } from './api/mocks'
import { apiRoutes } from './api/apiRoutes'
import {
  deleteTeamMember,
  getClients,
  getServices,
  getStockItems,
  getStocks,
  getTeamMember,
  getTeamMembers,
  getUserLogs,
  getVisitByVisitId,
  getVisits,
  patchTeamMemberSkill,
  patchUpdateVisit,
  postCreateNewClient,
  postCreateNewStockItem,
  postCreateService,
  postCreateVisit,
  postInviteTeamMember,
} from './api/api'

import { type UseMutationResult, useMutation } from '@tanstack/react-query'
import { useAxios } from './axios/axios'
import type { Client, ClientCreateData } from '../../entities/client'
import type { StockItemCreateData } from '../../entities/stock-item'
import type { Service, ServiceCreateData } from '../../entities/service'
import { type StockItem } from '../../entities/stock-item'
import { queryClient } from './reactQuery/reactTanstackQuerySetup'
import type { GetVisitsType, VisitWithServices, VisitCreateData, VisitDetailFormType } from '../../entities/visit'
import { DEFAULT_USERS_TEAM, type TeamMember } from '../../entities/team-member'

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

// ---- Services ----
export const useServicesQuery = () => {
  const axios = useAxios()

  return useQuery<Service[]>({
    queryKey: ['services'],
    queryFn: () => getServices(axios),
  })
}
export const useCreateServiceMutation = (): UseMutationResult<ServiceCreateData, Error, ServiceCreateData> => {
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
        throw new Error('Stock ID is required to fetch stock items.')
      }
      return getVisitByVisitId(axios, visitId)
    },
  })
}

export const useCreateVisitMutation = (): UseMutationResult<VisitCreateData, Error, VisitCreateData> => {
  const axios = useAxios()

  return useMutation<VisitCreateData, Error, VisitCreateData>({
    mutationFn: (visitData: VisitCreateData) => postCreateVisit(axios, visitData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] })
    },
  })
}

export const useUpdateVisitMutation = (
  visitId: string | undefined
): UseMutationResult<string, Error, VisitDetailFormType> => {
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

export const useVisitsQuery = () => {
  const axios = useAxios()

  return useQuery<GetVisitsType[]>({
    queryKey: ['visits'],
    queryFn: () => getVisits(axios),
  })
}

// ---- Clients----

export const useCreateNewClientMutation = (): UseMutationResult<ClientCreateData, Error, ClientCreateData> => {
  const axios = useAxios()

  return useMutation<ClientCreateData, Error, ClientCreateData>({
    mutationFn: (clientData: ClientCreateData) => postCreateNewClient(axios, clientData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['clients'] })
    },
  })
}

export const useClietsQuery = () => {
  const axios = useAxios()

  return useQuery<Client[]>({
    queryKey: ['clients'],
    queryFn: () => getClients(axios),
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

export const useCreateStockItemMutation = (): UseMutationResult<StockItemCreateData, Error, StockItemCreateData> => {
  const axios = useAxios()

  return useMutation<StockItemCreateData, Error, StockItemCreateData>({
    mutationFn: (stockItem: StockItemCreateData) => postCreateNewStockItem(axios, stockItem),
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
    enabled: !!stockId,
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
