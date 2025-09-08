import type { UserLog } from './entity'
import type { AxiosInstance } from 'axios'
import type { LogData } from '../entities/logs'
import { extractErrorMessage } from './errorHandler'
import type { Subscription, SubscriptionCreateData } from '../entities/subscription'

export const userApi = {
  get: (userId: string) => `/api/user?userId=${encodeURIComponent(userId)}`,
  getLogs: (userId: string) => `/api/logs?userId=${encodeURIComponent(userId)}`,
  getAllLogs: () => `/api/logs/`,
}

export const subscriptionApi = {
  get: () => `api/subscription`,
  create: () => `/api/subscription/`,
}

export const getUserLogs = async (axios: AxiosInstance, userId: string): Promise<UserLog[]> => {
  const response = await axios.get(userApi.get(userId))
  return response.data
}

export const getLogs = async (axios: AxiosInstance): Promise<LogData[]> => {
  const response = await axios.get(userApi.getAllLogs())
  return response.data
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
    const response = await axios.post(subscriptionApi.create(), params)
    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Platbu se nepovedlo vytvořit.'))
  }
}

export const getSubscription = async (axios: AxiosInstance): Promise<Subscription> => {
  try {
    const response = await axios.get(subscriptionApi.get())
    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Nepovedlo se načíst předplatné.'))
  }
}
