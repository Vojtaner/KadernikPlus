export const apiRoutes = {
  getUserLogsUrl: (userId: string) => `/api/logs?userId=${encodeURIComponent(userId)}`,
  getStockItemsUrl: (stockId: string) => `/api/stock/${encodeURIComponent(stockId)}/items`,
  getStockItemByIdUrl: (stockItemId: string) => `/item/${encodeURIComponent(stockItemId)}`,
  getUserUrl: (userId: string) => `/api/user?userId=${encodeURIComponent(userId)}`,
  getClientByIdUrl: (clientId: string) => `/api/clients/${encodeURIComponent(clientId)}`,
  getCreateNewClientUrl: () => `/api/clients`,
  getCreateStockItemUrl: () => `/api/stock`,
  getStocksUrl: () => `/api/stock`,
  getCreateServiceUrl: () => `/api/services`,
}
