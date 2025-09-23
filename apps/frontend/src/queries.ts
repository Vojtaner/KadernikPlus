import { useQuery } from '@tanstack/react-query'
import { useMutation } from '@tanstack/react-query'
import { useAxios } from './axios/axios'
import type { LogData } from './entities/logs'
import { useAddSnackbarMessage } from './hooks/useAddSnackBar'
import type { Subscription, SubscriptionCreateData } from './entities/subscription'
import {
  getLogs,
  getSubscription,
  getUser,
  postCancelSubscription,
  postCreateSubscription,
  postExtendSubscription,
  updateUserData,
} from './api/api'
import type { UserForm } from './entities/user'
import { queryClient } from './reactQuery/reactTanstackQuerySetup'

export const useSubscriptionQuery = () => {
  const axios = useAxios()

  return useQuery<Subscription | ''>({
    queryKey: ['subscription'],
    queryFn: () => getSubscription(axios),
  })
}

export const useUserDataQuery = () => {
  const axios = useAxios()

  return useQuery<UserForm>({
    queryKey: ['user'],
    queryFn: () => getUser(axios),
  })
}

export const useExtendSubscriptionMutation = () => {
  const axios = useAxios()
  const addSnackBarMessage = useAddSnackbarMessage()

  const mutation = useMutation<Subscription, Error, string>({
    mutationFn: async (subscriptionId: string) => postExtendSubscription(axios, subscriptionId),
    onSuccess: () => {
      addSnackBarMessage({ text: 'Předplatné prodlouženo', type: 'success' })
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
    },
    onError: (error) => {
      addSnackBarMessage({ text: error.message, type: 'error' })
      console.error(error)
    },
  })

  return { mutation }
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
      addSnackBarMessage({ text: error.message, type: 'error' })
      console.error(error)
    },
  })

  return { mutation }
}

export const useCancelSubscriptionMutation = () => {
  const axios = useAxios()
  const addSnackBarMessage = useAddSnackbarMessage()

  return useMutation<boolean, Error, string>({
    mutationFn: async (subscriptionId: string) => postCancelSubscription(axios, subscriptionId),
    onSuccess: () => {
      addSnackBarMessage({ text: 'Předplatné ukončeno.', type: 'success' })
    },
    onError: (error) => {
      addSnackBarMessage({ text: error.message, type: 'error' })
      console.error(error)
    },
  })
}

export const useUpdateUserMutation = () => {
  const axios = useAxios()
  const addSnackBarMessage = useAddSnackbarMessage()

  const mutation = useMutation<null, Error, UserForm>({
    mutationFn: async (data) => updateUserData(axios, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['user'] })
      addSnackBarMessage({ text: 'Uživatel upraven', type: 'success' })
    },
    onError: (error) => {
      addSnackBarMessage({ text: error.message, type: 'error' })
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
