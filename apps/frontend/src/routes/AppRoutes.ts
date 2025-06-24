export const AppRoutes = {
  Dashboard: '/',
  CustomerProfile: '/customer-profile/:customerId',
  VisitsList: '/visits-list',
  VisitDetail: '/visits-list/:visitId',
  NotFound: '*',
  Sms: '/sms',
  Logs: '/logs',
  Warehouse: '/warehouse',
  PriceList: '/prices',
  Consumption: '/consumption',
  MyProfile: '/my-profile',
  ShoppingList: '/shopping-list',
} as const

export type AppRoutePath = (typeof AppRoutes)[keyof typeof AppRoutes]

export const breadCrumbNameMap: Record<string, string> = {
  '/': 'Dashboard',
  'customer-profile': 'Profil zákazníka',
  'visits-list': 'Návštěvy',
  sms: 'SMS',
  logs: 'Záznamy o aktivitě',
  warehouse: 'Sklad',
  prices: 'Ceník',
  consumption: 'Spotřeba',
  'my-profile': 'Můj profil',
  'shopping-list': 'Nákupní seznam',
  '*': 'Stránka nenalezena',
}

export const generateVisitDetailPath = (visitId: string) => AppRoutes.CustomerProfile.replace(':customerId', visitId)

export function isActiveRoute(pathname: string, route: AppRoutePath): boolean {
  if (route === '*') {
    return false
  }
  if (route.includes('/:')) {
    const base = route.split('/:')[0]
    return pathname.startsWith(base)
  }
  return pathname === route.split('/')[1]
}
