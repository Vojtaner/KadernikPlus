import { type AxiosInstance } from 'axios'
import type { LogData } from '../entities/logs'
import type { Subscription, SubscriptionCreateData } from '../entities/subscription'
import type { UserForm } from '../entities/user'
import { apiCall } from '../hairdresser/entity'

export const userApi = {
  get: () => `/api/users`,
  getLogs: (userId: string) => `/api/logs?userId=${encodeURIComponent(userId)}`,
  getAllLogs: () => `/api/logs/`,
  deleteUser: () => `/api/users`,
}

export const subscriptionApi = {
  get: () => `api/subscription`,
  create: () => `/api/subscription/`,
  extend: (subscriptionId: string) => `/api/subscription/extend/${encodeURIComponent(subscriptionId)}`,
  cancel: (subscriptionId: string) => `/api/subscription/${encodeURIComponent(subscriptionId)}`,
}

export const updateUserData = async (axios: AxiosInstance, userData: UserForm): Promise<null> =>
  apiCall(async () => await axios.put(userApi.get(), userData), 'Uživatele se nepovedlo upravit.')

export const deleteUser = async (axios: AxiosInstance): Promise<{ deletionScheduledAt: string }> =>
  apiCall(async () => await axios.delete(userApi.deleteUser()), 'Uživatele se nepovedlo smazat.')

export const getLogs = async (axios: AxiosInstance): Promise<LogData[]> =>
  apiCall(async () => await axios.get(userApi.getAllLogs()), 'Logy se nepovedlo načíst.')

export const postCreateSubscription = async (
  axios: AxiosInstance,
  params: SubscriptionCreateData
): Promise<{
  code: number
  message: string
  transId: string
  redirect: string
}> => apiCall(async () => await axios.post(subscriptionApi.create(), params), 'Platbu se nepovedlo vytvořit.')

export const postCancelSubscription = async (axios: AxiosInstance, subscriptionId: string): Promise<boolean> =>
  apiCall(async () => await axios.post(subscriptionApi.cancel(subscriptionId)), 'Předplatné se nepovedlo ukončit.')

export const getSubscription = async (axios: AxiosInstance): Promise<Subscription> =>
  apiCall(async () => await axios.get(subscriptionApi.get()), 'Nepovedlo se načíst předplatné.')

export const postExtendSubscription = async (axios: AxiosInstance, subscriptionId: string): Promise<Subscription> =>
  apiCall(async () => await axios.post(subscriptionApi.extend(subscriptionId)), 'Nepovedlo se prodloužit předplatné.')

export const getUser = async (axios: AxiosInstance): Promise<UserForm> =>
  apiCall(async () => await axios.get(userApi.get()), 'Nepovedlo se načíst uživatele.')
