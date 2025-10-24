import type { ButtonProps } from '@mui/material';
import type { CommonProps } from '@mui/material/OverridableComponent';
import { cloneElement, type ReactElement } from 'react';
import type { AppPaletteColor } from '../entity';
import type { AxiosError, AxiosResponse } from 'axios';
import { extractErrorMessage } from '../api/errorHandler';
import type { User } from '@auth0/auth0-react';
import { isWoman, vocative } from 'czech-vocative';
import { capitalizeFirstLetter } from '../components/SmsTabs';
import dayjs from 'dayjs';
import type { VisitWithServicesWithProceduresWithStockAllowances } from './visits/entity';

export const addPropsToReactElement = (
  element: ReactElement,
  props: ButtonProps & CommonProps & { color?: AppPaletteColor },
) => {
  return cloneElement(element, { ...props });
};

export const phoneValidationRule = {
  pattern: {
    value: /^\+?[0-9]{7,15}$/,
    message: 'Zadejte platné telefonní číslo.',
  },
  maxLength: {
    value: 9,
    message: 'Číslo musí mít 9 znaků.',
  },
  minLength: {
    value: 9,
    message: 'Číslo musí mít 9 znaků.',
  },
};
export const firstNameValidationrule = {
  minLength: {
    value: 3,
    message: 'Jméno musí mít alespoň 3 znaky.',
  },
};

export const getButtonStyles = (active: boolean) => ({
  lineHeight: '18px',
  backgroundColor: active ? 'primary.main' : undefined,
  color: active ? 'white' : undefined,
});

export const getButtonStyle = <T>(tabelView: T, key: T) => {
  return tabelView === key ? 'contained' : 'text';
};

export const getQueryErrorMessage = (error: unknown) => {
  return (error as AxiosError<{ message: string }>).response?.data.message;
};

export const ApiError = (error: { message: string; statusCode: number }) => ({
  message: error.message,
  code: error.statusCode,
});

type ApiCall<T> = () => Promise<AxiosResponse<T>>;

export const apiCall = async <T>(fn: ApiCall<T>, defaultErrorMessage: string): Promise<T> => {
  try {
    const response = await fn();
    return response.data;
  } catch (e: unknown) {
    const error = e as AxiosError<{ message?: string; error?: string }>;
    const errorObject = extractErrorMessage(error, defaultErrorMessage);
    throw ApiError(errorObject);
  }
};

export const getGreeting = (user?: User) => {
  if (!user?.family_name) {
    return '';
  }

  const title = isWoman(user.family_name) ? 'paní' : 'pane';
  const name = capitalizeFirstLetter(vocative(user.family_name));

  return `${title} ${name}`;
};

export type Invoice = {
  invoiceNumber: string;
  customerName: string;
  customerEmail: string;
  notes: string;
  issuedAt: string;
  status: 'PAID' | 'CANCELLED' | 'PENDING';
  amount: number;
  currency: string;
};

export const APP_LAYOUT_WIDTH = 30;

export const getParsedFullName = (fullName: string) => {
  const splitedFullName = fullName.split(' ');

  if (splitedFullName.length === 1) {
    return { lastName: splitedFullName[0], firstName: '-' };
  } else {
    return { lastName: splitedFullName[1], firstName: splitedFullName[0] };
  }
};

type DateRange = {
  from?: Date;
  to?: Date;
};

type VisitMap = Map<string, { cost: number; revenue: number }>;
type Result = { costs: number[]; revenue: number[]; profit: number[]; labels: string[] };

export const getCostsProfitRevenue = (
  visits: VisitWithServicesWithProceduresWithStockAllowances[],
  range?: DateRange,
): Result => {
  const visitMap = aggregateVisitsByDate(visits, range);
  const allLabels = getDateLabelsInRange(visitMap, range);

  const costs: number[] = [];
  const revenue: number[] = [];
  const profit: number[] = [];

  const labelToKey = (label: string): string => {
    if (label.match(/^\d{2}\.\d{2}$/)) {
      const [day, month] = label.split('.');
      const year = range?.from ? dayjs(range.from).year() : dayjs().year();
      return dayjs(`${year}-${month}-${day}`, 'YYYY-MM-DD').format('YYYY-MM-DD');
    } else {
      return dayjs(label, 'MMMM YYYY').format('YYYY-MM');
    }
  };

  for (const label of allLabels) {
    const key = labelToKey(label);
    if (key.length === 10) {
      const entry = visitMap.get(key) ?? { cost: 0, revenue: 0 };
      costs.push(Math.round(entry.cost));
      revenue.push(Math.round(entry.revenue));
      profit.push(Math.round(entry.revenue - entry.cost));
    } else if (key.length === 7) {
      let monthCost = 0;
      let monthRevenue = 0;

      for (const [dateKey, val] of visitMap.entries()) {
        if (dateKey.startsWith(key)) {
          monthCost += val.cost;
          monthRevenue += val.revenue;
        }
      }
      costs.push(monthCost);
      revenue.push(monthRevenue);
      profit.push(monthRevenue - monthCost);
    }
  }

  return { labels: allLabels, costs, revenue, profit };
};

const aggregateVisitsByDate = (
  visits: VisitWithServicesWithProceduresWithStockAllowances[],
  range?: DateRange,
): VisitMap => {
  const map: VisitMap = new Map();

  for (const visit of visits) {
    const visitDate = new Date(visit.date);
    const visitOpen = !visit.visitStatus;
    if (range?.from && visitDate < range.from) {
      continue;
    }
    if (range?.to && visitDate > range.to) {
      continue;
    }

    if (visitOpen) {
      continue;
    }

    const key = visitDate.toISOString().split('T')[0];
    const revenue = parseFloat(`${visit.paidPrice}`);
    const cost = calculateVisitCost(visit);

    const existing = map.get(key);
    if (existing) {
      existing.revenue += revenue;
      existing.cost += cost;
    } else {
      map.set(key, { cost, revenue });
    }
  }

  return map;
};

const calculateVisitCost = (visit: VisitWithServicesWithProceduresWithStockAllowances): number => {
  let total = 0;

  for (const procedure of visit.procedures ?? []) {
    for (const allowance of procedure.stockAllowances ?? []) {
      const qty = parseFloat(`${allowance.quantity}`);
      const avgUnitPriceAtTheTime = parseFloat(`${allowance.avgUnitPrice}`);
      total += qty * avgUnitPriceAtTheTime;
    }
  }
  return total;
};

const getDateLabelsInRange = (map: VisitMap, range?: DateRange): string[] => {
  const labels: string[] = [];

  if (range?.from && range?.to) {
    const from = dayjs(range.from).startOf('day');
    const to = dayjs(range.to).startOf('day');
    const diffDays = to.diff(from, 'day');

    if (diffDays > 60) {
      let cursor = from.startOf('month');
      while (cursor.isBefore(to) || cursor.isSame(to, 'month')) {
        labels.push(cursor.format('MMMM YYYY'));
        cursor = cursor.add(1, 'month');
      }
    } else {
      let cursor = from;
      while (cursor.isBefore(to) || cursor.isSame(to, 'day')) {
        labels.push(cursor.format('DD.MM'));
        cursor = cursor.add(1, 'day');
      }
    }
  } else {
    labels.push(...Array.from(map.keys()));
    labels.sort((a, b) => dayjs(a).unix() - dayjs(b).unix());
  }

  return labels;
};
