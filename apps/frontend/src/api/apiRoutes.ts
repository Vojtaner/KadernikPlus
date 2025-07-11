export const apiRoutes = {
  getUserLogsUrl: (userId: string) => `/api/logs?userId=${encodeURIComponent(userId)}`,
  getStockItemsUrl: () => '/api/stock-items',
  getUserUrl: (userId: string) => `/api/user?userId=${encodeURIComponent(userId)}`,
}
