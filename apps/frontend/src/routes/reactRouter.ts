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

export const useAppLocation = () => {
  return useLocation() as Location<AppLocationState>
}

export const getNthPathName = (
  pathNames: string[],
  order: number,
  appendix?: string
): { pageTitle: string; appendix: undefined | string } => {
  if (appendix) {
    return { pageTitle: breadCrumbNameMap[pathNames[order]], appendix: appendix }
  }

  return { pageTitle: breadCrumbNameMap[pathNames[order]] ?? 'Přehled', appendix: undefined }
}

export const getPathNameWithOutSlash = (pathname: AppRoutePath): string[] =>
  pathname
    .split('/')
    .filter(Boolean)
    .filter((segment) => !segment.startsWith(':'))
