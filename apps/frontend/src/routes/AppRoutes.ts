export const AppRoutes = {
  Dashboard: '/',
  CustomerProfile: '/customer-profile/:customerId',
  VisitsList: '/visits-list',
  NotFound: '*',
  Sms: '/sms',
  VisitDetail: 'visit-detail',
  Logs: 'logs',
  Warehouse: 'warehouse',
  PriceList: 'prices',
  Consumption: 'consumption',
  MyProfile: 'my-profile',
  ShoppingList: 'shopping-list',
} as const

export const generateVisitDetailPath = (visitId: string) => AppRoutes.CustomerProfile.replace(':customerId', visitId)
