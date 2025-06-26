import { hairToolApi } from '../axios/axios'
import { http, HttpResponse, type PathParams } from 'msw'
import type { UserType } from './entity'

export const getUser = async () => {
  const { data: userData } = await hairToolApi.get('todos/1')

  return userData
}

export const mockGetUser = () =>
  http.get<object, PathParams<string>, UserType>('todos/1', () => {
    return HttpResponse.json({
      userId: '1',
      name: 'Marie Vrnková',
      age: 45,
      email: 'marie@email.cz',
    })
  })
