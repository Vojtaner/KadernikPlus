import type { AxiosInstance } from 'axios'
import type { LogData } from '../entities/logs'
import { extractErrorMessage } from './errorHandler'
import type { Subscription, SubscriptionCreateData } from '../entities/subscription'
import type { User } from '../entities/user'

export const userApi = {
  get: () => `/api/users`,
  getLogs: (userId: string) => `/api/logs?userId=${encodeURIComponent(userId)}`,
  getAllLogs: () => `/api/logs/`,
}

export const subscriptionApi = {
  get: () => `api/subscription`,
  create: () => `/api/subscription/`,
}

export const updateUserData = async (axios: AxiosInstance, userData: User): Promise<null> => {
  try {
    const response = await axios.put(userApi.get(), userData)
    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Uživatele se nepovedlo upravit.'))
  }
}

export const getLogs = async (axios: AxiosInstance): Promise<LogData[]> => {
  try {
    const response = await axios.get(userApi.getAllLogs())
    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Logy se nepovedlo načíst.'))
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

export const getUser = async (axios: AxiosInstance): Promise<User> => {
  try {
    const response = await axios.get(userApi.get())
    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Nepovedlo se načíst uživatele.'))
  }
}
