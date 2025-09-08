import { type UseMutationResult, useMutation, useQuery } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { useAxios } from '../../axios/axios'
import type {
  ClientOrUpdateCreateData,
  ClientSearchPayload,
  ClientWithVisitsWithVisitServices,
  Client,
  ClientWithVisits,
} from '../../entities/client'
import { useAddSnackbarMessage } from '../../hooks/useAddSnackBar'
import { queryClient } from '../../reactQuery/reactTanstackQuerySetup'
import { postCreateNewClient, patchSearchClients, getClients, getClientById } from './api'

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
      addSnackBarMessage({ text: error.message, type: 'error' })
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
