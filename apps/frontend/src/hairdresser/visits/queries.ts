import { useQuery, useMutation, type UseMutationOptions } from '@tanstack/react-query'
import dayjs from 'dayjs'
import { useAxios } from '../../axios/axios'
import { useAddSnackbarMessage } from '../../hooks/useAddSnackBar'
import { queryClient } from '../../reactQuery/reactTanstackQuerySetup'
import {
  getVisitByVisitId,
  postCreateVisit,
  patchUpdateVisitStatus,
  patchUpdateVisit,
  getVisits,
  deleteVisit,
} from './api'
import {
  type VisitWithServicesHotFix,
  type CreateVisitType,
  type VisitDetailFormType,
  type VisitWithServicesWithProceduresWithStockAllowances,
  type VisitsByDateQueryParams,
  getVisitsByDateQueryKey,
} from './entity'
import { getClientVisits } from '../client/api'
import { STORAGE_KEY, type PersistentFiltersType } from '../../hooks'

export const useClientVisitsQuery = (clientId: string | undefined, isEnabled?: boolean) => {
  const axios = useAxios()

  return useQuery<VisitWithServicesWithProceduresWithStockAllowances[]>({
    queryKey: [clientId, 'visits'],
    queryFn: () => {
      if (!clientId) {
        throw Error('Chybí ID klienta.')
      }

      return getClientVisits(axios, clientId)
    },
    staleTime: 24 * 60 * 60 * 1000,
    enabled: isEnabled,
    refetchOnWindowFocus: false,
  })
}

export const useDeleteVisitMutation = () => {
  const axios = useAxios()
  const addSnackBarMessage = useAddSnackbarMessage()

  return useMutation<string, Error, string | undefined>({
    mutationFn: async (visitId: string | undefined) => {
      if (!visitId) {
        throw new Error('ID návštěvy je nutné k jejímu smazání.')
      }

      await deleteVisit(axios, visitId)

      return visitId
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['visits'] })
      addSnackBarMessage({ text: 'Návštěva byla smazána.', type: 'success' })
    },
    onError: (error) => {
      addSnackBarMessage({ text: error.message, type: 'error' })
      console.error(error)
    },
  })
}

export const getVisitByIdQueryKey = (visitId: string | undefined) => ['visit', visitId]

export const useVisitQuery = (visitId: string | undefined, enabled = true) => {
  const axios = useAxios()

  return useQuery<VisitWithServicesHotFix>({
    queryKey: getVisitByIdQueryKey(visitId),
    queryFn: async () => {
      if (!visitId) {
        throw new Error('ID návštěvy je povinné.')
      }

      return getVisitByVisitId(axios, visitId).then((data) => ({
        ...data,
        paidPrice: Number(data.paidPrice),
        deposit: Number(data.deposit),
      }))
    },
    enabled,
    refetchOnMount: false,
    staleTime: 20 * 60 * 1000,
  })
}

export const useCreateVisitMutation = (options?: UseMutationOptions<CreateVisitType, Error, CreateVisitType>) => {
  const axios = useAxios()
  const addSnackBarMessage = useAddSnackbarMessage()

  return useMutation<CreateVisitType, Error, CreateVisitType>({
    mutationFn: (visitData: CreateVisitType) => postCreateVisit(axios, visitData),
    onSuccess: (visitData, variables, context) => {
      options?.onSuccess?.(visitData, variables, context)
      queryClient.invalidateQueries({ queryKey: ['visits'] })
      queryClient.invalidateQueries({ queryKey: ['clients'] })
      queryClient.invalidateQueries({ queryKey: ['client', visitData.clientId] })
      addSnackBarMessage({ text: 'Návštěva byla uložena.', type: 'success' })
    },
    onError: (error) => {
      addSnackBarMessage({ text: error.message, type: 'error' })
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
      queryClient.invalidateQueries({ queryKey: getVisitByIdQueryKey(data.visitId) })
      queryClient.invalidateQueries({ queryKey: ['visits'] })
      addSnackBarMessage({ text: 'Stav návštěvy byl upraven.', type: 'success' })
    },
    onError: (error) => {
      addSnackBarMessage({ text: error.message, type: 'error' })
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
      const persistentFilters = localStorage.getItem(STORAGE_KEY)
      const { from, to }: PersistentFiltersType['visits']['dashBoardVisitOverView']['dates'] = persistentFilters
        ? JSON.parse(persistentFilters).visits.dashBoardVisitOverView.dates
        : ''

      queryClient.invalidateQueries({ queryKey: getVisitByIdQueryKey(visitId) })
      queryClient.invalidateQueries({
        queryKey: ['visits', dayjs(from).format('YYYY-MM-DD'), dayjs(to).format('YYYY-MM-DD')],
      })

      addSnackBarMessage({ text: 'Návštěva byla upravena.', type: 'success' })
    },
    onError: (error) => {
      addSnackBarMessage({ text: error.message, type: 'error' })
      console.error(error)
    },
  })
}

export const useVisitsQuery = (params: VisitsByDateQueryParams) => {
  const axios = useAxios()

  return useQuery<VisitWithServicesWithProceduresWithStockAllowances[]>({
    queryKey: getVisitsByDateQueryKey(params),
    queryFn: () => {
      return getVisits(axios, params.query, params.date)
    },
    staleTime: 20 * 60 * 1000,
  })
}
