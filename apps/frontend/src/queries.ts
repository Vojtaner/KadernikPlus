import { useQuery } from '@tanstack/react-query'
import { getUserLogs, getWarehouseItems } from './api/api'
import type { UserLog, WareHouseItemStateType } from './api/entity'

export const useUserLogsQuery = (userId: string) => {
  return useQuery<UserLog[]>({
    queryKey: ['userLogs', userId],
    queryFn: () => getUserLogs(userId),
    enabled: !!userId,
  })
}

export const useWareHouseQuery = (userId: string) => {
  return useQuery<WareHouseItemStateType[]>({
    queryKey: ['warehouse', userId],
    queryFn: () => getWarehouseItems(userId),
    enabled: !!userId,
  })
}
