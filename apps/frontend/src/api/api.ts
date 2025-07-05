import { hairToolApi } from '../axios/axios'
import { http, HttpResponse, type PathParams } from 'msw'
import type { UserLog, UserType } from './entity'
import { mockUserLogs, mockUser, mockWarehouseState } from './mocks'

export const getUser = async () => {
  const { data: userData } = await hairToolApi.get('user/1')
  return userData
}

export const mockGetUser = () =>
  http.get<object, PathParams<string>, UserType>('todos/1', () => {
    return HttpResponse.json(mockUser)
  })

export const getUserLogs = async (userId: string) => {
  const response = await hairToolApi.get(`/api/logs`, {
    params: { userId },
  })
  return response.data
}

export const mockGetUserLogs = () =>
  http.get<object, PathParams<string>, UserLog[]>('/api/logs?userId=1', () => {
    return HttpResponse.json(mockUserLogs)
  })

export const getWarehouseItems = async (userId: string) => {
  const response = await hairToolApi.get('/api/user/warehouse', {
    params: { userId },
  })
  return response.data
}

export const mockGetWareHouseItems = () =>
  http.get('/api/user/warehouse', () => {
    return HttpResponse.json(mockWarehouseState)
  })
