import type { AxiosInstance } from 'axios';
import type dayjs from 'dayjs';
import type { Stock } from '../../api/entity';
import type { GetStockAllowance } from '../../entity';
import type { StockItemCreateData, StockWithStockItems } from './entity';
import type { Dayjs } from 'dayjs';
import { apiCall } from '../entity';

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
};

export const getStocks = async (axios: AxiosInstance): Promise<Stock[]> =>
  apiCall(async () => await axios.get(stockApi.getAll()), 'Sklad se nepovedlo najít.');

export const getStockItems = async (
  axios: AxiosInstance,
  stockId: string
): Promise<StockWithStockItems[]> =>
  apiCall(
    async () => await axios.get(stockApi.getItems(stockId)),
    'Skladové položky se nepovedlo najít.'
  );

export const getStockAllowances = async (
  axios: AxiosInstance,
  params: { teamId: string; fromDate: dayjs.Dayjs; toDate: dayjs.Dayjs }
): Promise<GetStockAllowance[]> =>
  apiCall(
    async () => await axios.get(stockApi.getAllowances(params)),
    'Spotřebu se nepovedlo najít.'
  );

export const postCreateNewStockItem = async (
  axios: AxiosInstance,
  stockItem: StockItemCreateData
): Promise<StockItemCreateData> =>
  apiCall(
    async () => await axios.post(stockApi.createOrUpdateItem(), stockItem),
    'Materiál se nepodařilo přidat/upravit.'
  );

export const deleteStockItem = async (axios: AxiosInstance, stockItemId: string): Promise<void> =>
  apiCall(
    async () => await axios.delete(stockApi.deleteItemById(stockItemId)),
    'Skladovou položku se nepovedlo smazat.'
  );
