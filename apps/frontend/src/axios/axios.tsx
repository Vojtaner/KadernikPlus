import { useAuth0 } from '@auth0/auth0-react'
import axios, { type AxiosInstance } from 'axios'
import { createContext, useContext, useMemo, type ReactNode } from 'react'

const AxiosContext = createContext<AxiosInstance | undefined>(undefined)

export const useAxios = (): AxiosInstance => {
  const context = useContext(AxiosContext)

  if (!context) {
    throw new Error('useAxios must be used inside AxiosProvider')
  }
  return context
}

export const AxiosProvider = ({ children }: { children: ReactNode }) => {
  const { getAccessTokenSilently } = useAuth0()

  const axiosInstance = useMemo(() => {
    const instance = axios.create({
      baseURL: import.meta.env.VITE_API_URL,
    })

    instance.interceptors.request.use(async (config) => {
      const token = await getAccessTokenSilently({
        authorizationParams: {
          audience: import.meta.env.VITE_AUT0_AUDIENCE,
          scope: 'read:current_user',
        },
      })

      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }

      return config
    })

    return instance
  }, [getAccessTokenSilently])

  return <AxiosContext.Provider value={axiosInstance}>{children}</AxiosContext.Provider>
}
