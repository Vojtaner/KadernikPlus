export const AppRoutes = {
  Dashboard: '/',
  ClientProfile: '/client-profile/:clientId',
  VisitsList: '/visits-list',
  VisitDetail: '/visits-list/:visitId',
  NotFound: '*',
  Sms: '/sms',
  Logs: '/logs',
  stock: '/stock/:stockId',
  PriceList: '/prices',
  ClientList: '/clients',
  Consumption: '/consumption',
  MyProfile: '/my-profile',
  ShoppingList: '/shopping-list',
  Login: '/login',
  Team: '/team/:teamId',
} as const

export type AppRoutePath = (typeof AppRoutes)[keyof typeof AppRoutes]

export const breadCrumbNameMap: Record<string, string> = {
  '/': 'Dashboard',
  'client-profile': 'Profil zákazníka',
  'visits-list': 'Návštěvy',
  sms: 'SMS',
  logs: 'Záznamy o aktivitě',
  stock: 'Sklad',
  prices: 'Ceník',
  consumption: 'Spotřeba',
  'my-profile': 'Můj profil',
  'shopping-list': 'Nákupní seznam',
  '*': 'Stránka nenalezena',
  clients: 'Klienti',
  team: 'Tým',
}

export const generateClientDetailPath = (clientId: string) => AppRoutes.ClientProfile.replace(':clientId', clientId)
export const generateStockPath = (stockId: string) => AppRoutes.stock.replace(':stockId', stockId)
export const generateTeamPath = (teamId: string) => AppRoutes.Team.replace(':teamId', teamId)

export function isActiveRoute(pathname: string, route: AppRoutePath): boolean {
  if (route === '*') {
    return false
  }

  if (route.includes('/:')) {
    const base = route.split('/:')[0]

    if (!pathname) {
      return false
    }

    return pathname.startsWith(base)
  }

  return pathname === route.split('/')[1]
}
