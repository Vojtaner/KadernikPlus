import { mockGetUser, mockGetUserLogs, mockGetWareHouseItems } from '../api/api'

export const handlers = [mockGetUser(), mockGetUserLogs(), mockGetWareHouseItems()]
