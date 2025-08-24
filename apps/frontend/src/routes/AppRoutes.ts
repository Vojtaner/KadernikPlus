import { generatePath, matchPath, useLocation, type Params } from 'react-router-dom'

export type AppRoute = {
  path: string
  breadcrumb: string
}
export type AppRoutePath = (typeof ROUTES)[keyof typeof ROUTES]['path']

export const ROUTES = {
  clients: { path: '/clients', breadcrumb: 'Klienti' },
  clientDetail: { path: '/clients/:clientId', breadcrumb: 'Detail klienta' },
  visitDetail: { path: '/clients/:clientId/visits/:visitId', breadcrumb: 'Detail návštěvy' },
  visits: { path: '/visits', breadcrumb: 'Všechny návštěvy' },
  team: { path: '/team/:teamId', breadcrumb: 'Tým' },
  shoppingList: { path: '/shopping-list', breadcrumb: 'Nákupní seznam' },
  profile: { path: '/profile', breadcrumb: 'Můj profil' },
  subscription: { path: '/pub/subscription', breadcrumb: '' },
  consumption: { path: '/consumption', breadcrumb: 'Spotřeba' },
  services: { path: '/services', breadcrumb: 'Služby' },
  stock: { path: '/stock/:stockId', breadcrumb: 'Sklad' },
  logs: { path: '/logs', breadcrumb: 'Záznamy o aktivitě' },
  sms: { path: '/sms', breadcrumb: 'SMSky' },
  home: { path: '/', breadcrumb: 'Přehled' },
  notFound: { path: '*', breadcrumb: 'Nenalezeno' },
} as const

export const Paths = {
  clientDetail: (clientId: string) => generatePath(ROUTES.clientDetail.path, { clientId }),

  visitDetail: (clientId: string, visitId: string) => generatePath(ROUTES.visitDetail.path, { clientId, visitId }),

  team: (teamId: string) => generatePath(ROUTES.team.path, { teamId }),

  stock: (stockId: string) => generatePath(ROUTES.stock.path, { stockId }),
}

type CurrentRoute = {
  key: keyof typeof ROUTES
  path: string
  breadcrumb: string
  params: Params<string>
} | null

export const useCurrentRoute = (): CurrentRoute => {
  const location = useLocation()

  for (const [key, route] of Object.entries(ROUTES)) {
    const match = matchPath({ path: route.path, end: route.path !== '*' }, location.pathname)

    if (match) {
      return {
        key: key as keyof typeof ROUTES,
        path: route.path,
        breadcrumb: route.breadcrumb,
        params: match.params,
      }
    }
  }

  return null
}
