import type { AxiosInstance } from 'axios'
import type dayjs from 'dayjs'
import type { Stock } from '../../api/entity'
import { extractErrorMessage } from '../../api/errorHandler'
import type { GetStockAllowance } from '../../entity'
import type { StockItemCreateData, StockWithStockItems } from './entity'
import type { Dayjs } from 'dayjs'

export const stockApi = {
  getItems: (stockId: string) => `/api/stock/items?stockId=${encodeURIComponent(stockId)}`,
  getItemById: (stockItemId: string) => `/item/${encodeURIComponent(stockItemId)}`,
  deleteItemById: (stockItemId: string) => `api/stock/item/${encodeURIComponent(stockItemId)}`,
  createOrUpdateItem: () => `/api/stock`,
  getAll: () => `/api/stock`,
  getAllowances: (params: { teamId: string; fromDate: Dayjs; toDate: Dayjs }) =>
    `/api/stock-allowance/${encodeURIComponent(params.teamId)}?fromDate=${encodeURIComponent(
      params.fromDate.toISOString()
    )}&toDate=${encodeURIComponent(params.toDate.toISOString())}`,
}

export const getStocks = async (axios: AxiosInstance): Promise<Stock[]> => {
  try {
    const response = await axios.get(stockApi.getAll())
    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Sklad se nepovedlo najít.'))
  }
}

export const getStockItems = async (axios: AxiosInstance, stockId: string): Promise<StockWithStockItems[]> => {
  try {
    const response = await axios.get(stockApi.getItems(stockId))
    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Skladové položky se nepovedlo najít.'))
  }
}

export const getStockAllowances = async (
  axios: AxiosInstance,
  params: { teamId: string; fromDate: dayjs.Dayjs; toDate: dayjs.Dayjs }
): Promise<GetStockAllowance[]> => {
  try {
    const response = await axios.get(stockApi.getAllowances(params))

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Spotřebu se nepovedlo najít.'))
  }
}

export const postCreateNewStockItem = async (
  axios: AxiosInstance,
  stockItem: StockItemCreateData
): Promise<StockItemCreateData> => {
  try {
    const response = await axios.post(stockApi.createOrUpdateItem(), stockItem)

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Materiál se nepodařilo přidat/upravit.'))
  }
}

export const deleteStockItem = async (axios: AxiosInstance, stockItemId: string): Promise<void> => {
  try {
    const response = await axios.delete(stockApi.deleteItemById(stockItemId))

    return response.data
  } catch (error) {
    throw new Error(extractErrorMessage(error, 'Skladovou položku se nepovedlo smazat.'))
  }
}
