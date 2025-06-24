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

export const breadCrumbNameMap: Record<AppRoutePath, string> = {
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
