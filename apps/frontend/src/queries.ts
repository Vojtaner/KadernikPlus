import { useQuery } from '@tanstack/react-query'
import { getUserLogs, getStockItems } from './api/api'
import type { UserLog, WareHouseItemStateType } from './api/entity'

export const useUserLogsQuery = (userId: string) => {
  return useQuery<UserLog[]>({
    queryKey: ['userLogs', userId],
    queryFn: () => getUserLogs(userId),
    enabled: !!userId,
  })
}

export const useWareHouseQuery = () => {
  return useQuery<WareHouseItemStateType[]>({
    queryKey: ['warehouse'],
    queryFn: getStockItems,
  })
}
