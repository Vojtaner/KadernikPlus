export const apiRoutes = {
  getUserLogsUrl: (userId: string) => `/api/logs?userId=${encodeURIComponent(userId)}`,
  getStockItemsUrl: (stockId: string) => `/api/stock/${encodeURIComponent(stockId)}/items`,
  getStockItemByIdUrl: (stockItemId: string) => `/item/${encodeURIComponent(stockItemId)}`,
  getUserUrl: (userId: string) => `/api/user?userId=${encodeURIComponent(userId)}`,
  getClientByIdUrl: (clientId: string) => `/api/clients/${encodeURIComponent(clientId)}`,
  getClientsUrl: () => `/api/clients/`,
  getCreateNewClientUrl: () => `/api/clients`,
  getCreateStockItemUrl: () => `/api/stock`,
  getProceduresUrl: (visitId: string) => `/api/procedures/visit/${encodeURIComponent(visitId)}`,
  getStocksUrl: () => `/api/stock`,
  getServiceUrl: () => `/api/services`,
  getVisitUrl: (query?: { from?: string; to?: string }) => getVisitUrlComposed(query),
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

const getVisitUrlComposed = (query?: { from?: string; to?: string }) => {
  if (!query) {
    return '/api/visits'
  }

  const params = new URLSearchParams()

  if (query.from) {
    params.append('from', query.from)
  }
  if (query.to) {
    params.append('to', query.to)
  }

  return `/api/visits?${params.toString()}`
}
