import { useLocation } from 'react-router-dom'
import { breadCrumbNameMap, type AppRoutePath } from './AppRoutes'

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

export const getNthPathName = (pathNames: AppRoutePath[], order: number) => {
  return breadCrumbNameMap[pathNames[order]]
}

export const getPathNameWithOutSlash = (pathname: AppRoutePath) =>
  pathname === '/'
    ? [pathname]
    : pathname
        .split('/')
        .filter(Boolean)
        .filter((p): p is AppRoutePath => p in breadCrumbNameMap)
