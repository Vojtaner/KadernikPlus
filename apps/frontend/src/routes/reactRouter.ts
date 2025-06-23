import { useLocation } from 'react-router-dom'
import type { AppRoutePath } from './AppRoutes'

export type AppLocationState = object

type Location<T> = {
  pathname: AppRoutePath
  search: string
  hash: string
  state: T
  key: string
}

export const useTypedLocation = () => {
  return useLocation() as Location<AppLocationState>
}
