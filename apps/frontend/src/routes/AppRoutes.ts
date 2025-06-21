export const AppRoutes = {
  HomeOverview: '/',
  VisitDetail: '/visit/:visitId',
  NotFound: '*',
}

export const generateVisitDetailPath = (visitId: string) => AppRoutes.VisitDetail.replace(':visitId', visitId)
