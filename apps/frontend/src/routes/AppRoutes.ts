export const AppRoutes = {
  HomeOverview: '/',
  CustomerVisitsList: '/customerVisits/:customerId',
  VisitsList: '/visitsList',
  NotFound: '*',
}

export const generateVisitDetailPath = (visitId: string) => AppRoutes.CustomerVisitsList.replace(':customerId', visitId)
