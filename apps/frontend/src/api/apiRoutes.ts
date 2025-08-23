import type dayjs from 'dayjs'
import type { Dayjs } from 'dayjs'

export const apiRoutes = {
  getUserLogsUrl: (userId: string) => `/api/logs?userId=${encodeURIComponent(userId)}`,
  getStockItemsUrl: (stockId: string) => `/api/stock/${encodeURIComponent(stockId)}/items`,
  getLogsUrl: () => `/api/logs/`,
  getStockAllowancesUrl: (params: { teamId: string; fromDate: dayjs.Dayjs; toDate: dayjs.Dayjs }) =>
    `/api/stock-allowance/${encodeURIComponent(params.teamId)}?fromDate=${encodeURIComponent(params.fromDate.toISOString())}&toDate=${encodeURIComponent(params.toDate.toISOString())}`,
  getStockItemByIdUrl: (stockItemId: string) => `/item/${encodeURIComponent(stockItemId)}`,
  deleteStockItemByIdUrl: (stockItemId: string) => `api/stock/item/${encodeURIComponent(stockItemId)}`,
  getUserUrl: (userId: string) => `/api/user?userId=${encodeURIComponent(userId)}`,
  getClientByIdUrl: (clientId: string) => `/api/clients/${encodeURIComponent(clientId)}`,
  getClientsUrl: () => `/api/clients/`,
  getCreateNewClientUrl: () => `/api/clients`,
  getClientVisits: (clientId: string) => `api/visits/client/${encodeURIComponent(clientId)}`,
  getCreateOrUpdateStockItemUrl: () => `/api/stock`,
  getVisitProceduresUrl: (visitId: string) => `/api/procedures/visit/${encodeURIComponent(visitId)}`,
  getProceduresUrl: (procedureId: string) => `/api/procedures/${encodeURIComponent(procedureId)}`,
  getStocksUrl: () => `/api/stock`,
  getServiceUrl: () => `/api/services`,
  getVisitUrl: (date?: Dayjs, query?: { from?: Dayjs; to?: Dayjs }) => getVisitUrlComposed(date, query),
  getUpdateVisitStatusUrl: () => `/api/visits/status`,
  getUpdateVisitUrl: (visitId: string) => `/api/visits/${encodeURIComponent(visitId)}`,
  getVisitByVisitIdUrl: (visitId: string) => `/api/visits/${encodeURIComponent(visitId)}`,
  getTeamUrl: () => `/api/team/`,
  getTeamMembersUrl: (teamId: string) => `/api/team-members/${encodeURIComponent(teamId)}`,
  getTeamMemberUrl: () => `/api/team-members/`,
  getInviteTeamMemberUrl: () => `/api/team-members/invitation`,
  getUpdateTeamMemberUrl: (teamId: string) => `/api/team-members/${encodeURIComponent(teamId)}`,
  getSearchClientsUrl: (nameOrPhone: string) => `/api/clients/search?query=${encodeURIComponent(nameOrPhone)}`,
}

const getVisitUrlComposed = (date?: Dayjs, query?: { from?: Dayjs; to?: Dayjs }) => {
  const params = new URLSearchParams()

  if (date && date.isValid()) {
    params.append('date', date.toISOString())
    return `/api/visits?${params.toString()}`
  }

  if (query) {
    if (query.from) {
      params.append('from', query.from.toISOString())
    }
    if (query.to) {
      params.append('to', query.to.toISOString())
    }

    return `/api/visits?${params.toString()}`
  }

  return '/api/visits'
}
