export const userApi = {
  get: (userId: string) => `/api/user?userId=${encodeURIComponent(userId)}`,
  getLogs: (userId: string) => `/api/logs?userId=${encodeURIComponent(userId)}`,
  getAllLogs: () => `/api/logs/`,
}

export const subscriptionApi = {
  get: () => `api/subscription`,
  create: () => `/api/subscription/`,
}
