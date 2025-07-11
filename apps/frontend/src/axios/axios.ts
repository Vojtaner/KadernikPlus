import { useAuth0 } from '@auth0/auth0-react'
import axios from 'axios'

const apiUrl = import.meta.env.VITE_ENABLE_MOCKS === 'true'

export const hairToolApi = axios.create(
  apiUrl
    ? {}
    : {
        baseURL: `http://localhost:${import.meta.env.VITE_PORT}`,
      }
)

hairToolApi.interceptors.request.use((config) => {
  const { getAccessTokenSilently } = useAuth0()
  const token = getAccessTokenSilently()
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})
