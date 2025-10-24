import AppTheme from './AppTheme';
import { getDate } from './hairdresser/visits/entity';

export type AppPalette = typeof AppTheme.palette;
export type AppPaletteColor = keyof AppPalette;
export type AppPaletteShade<C extends AppPaletteColor> = keyof AppPalette[C];

export type AppPaletteColorString = `${AppPaletteColor}.${string}`;

export const formatNameShort = (fullName: string): string => {
  const parts = fullName.trim().split(/\s+/);
  const firstInitial = parts[1] || '';
  const lastName = parts[0]?.charAt(0).toUpperCase() || '';
  return firstInitial ? `${lastName}. ${firstInitial}` : lastName;
};

export type VisitViewKey = 'byClosedNoStockAllowances' | 'byAll';

export type GetStockAllowance = {
  createdAt: Date;
  id: string;
  procedure: { visitId: string; visit: { clientId: string } };
  procedureId: string;
  quantity: string;
  stockItem: { unit: string };
  stockItemName: string;
  avgUnitPrice: string;
  stockItemId: string;
  teamId: string;
  user: { name: string };
  userId: string;
};

export type ConsumptionTableAllRecordType = {
  id: string;
  stockItemName: string;
  totalPrice: number;
  stockAllowanceQuantity: number;
  unit: string;
  user: string;
  date: Date;
  visitId: string;
  clientId: string;
};
export type ConsumptionTableByProductByUserType = {
  id: string;
  stockItemName: string;
  totalPrice: number;
  totalQuantity: number;
  unit: string;
  user: string;
};

export type UserStockItemAllowanceSummary = {
  id: string;
  user: string;
  stockItemName: string;
  unit: string;
  totalQuantity: number;
  totalPrice: number;
};

export type StockViewKey = 'byUser' | 'byProduct' | 'allRecords';

export const useScrollToTheTop = () => {
  function scrollToTop() {
    document.documentElement.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  return scrollToTop;
};

export const getSubscriptionText = (endDate: Date, status?: string): string => {
  switch (status) {
    case 'EXPIRED':
      return 'vypršelo';
    case 'CANCELLED':
      return `bylo zrušeno, dne ${getDate(endDate)} se již nedostanete do aplikace.`;
    case 'PENDING':
      return 'není zaplacené, koukněte do emailu.';
    default:
      return 'je platné';
  }
};
