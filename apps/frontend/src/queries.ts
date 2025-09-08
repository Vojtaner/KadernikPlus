import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { useAxios } from './axios/axios'
import type { LogData } from './entities/logs'
import { useAddSnackbarMessage } from './hooks/useAddSnackBar'
import type { Subscription, SubscriptionCreateData } from './entities/subscription'
import { getLogs, getSubscription, postCreateSubscription } from './api/api'

export const useSubscriptionQuery = () => {
  const axios = useAxios()

  return useQuery<Subscription | ''>({
    queryKey: ['subscription'],
    queryFn: () => getSubscription(axios),
  })
}

export const useSubscriptionMutation = () => {
  const axios = useAxios()
  const addSnackBarMessage = useAddSnackbarMessage()

  const mutation = useMutation<
    {
      code: number
      message: string
      transId: string
      redirect: string
    },
    Error,
    SubscriptionCreateData
  >({
    mutationFn: async (data) => postCreateSubscription(axios, data),
    onSuccess: (data) => {
      addSnackBarMessage({ text: 'Platba založena', type: 'success' })
      window.location.assign(data.redirect)
    },
    onError: (error) => {
      addSnackBarMessage({ text: 'Platbu se nepovedlo založit.', type: 'error' })
      console.error(error)
    },
  })

  return { mutation }
}

export const useLogsQuery = () => {
  const axios = useAxios()

  return useQuery<LogData[]>({
    queryKey: ['logs'],
    queryFn: () => {
      return getLogs(axios)
    },
  })
}
