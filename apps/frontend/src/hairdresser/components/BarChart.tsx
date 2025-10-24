import { BarChart } from '@mui/x-charts/BarChart';
import AppTheme from '../../AppTheme';
import type { VisitWithServicesWithProceduresWithStockAllowances } from '../visits/entity';
import type { DatesRange } from '../../hooks';
import { useState } from 'react';
import RevenuCard, { type RevenueStatistic } from '../../components/RevenuCard';
import { useIntl } from 'react-intl';
import { getCostsProfitRevenue } from '../entity';

type AppBarChartProps = {
  visitData: VisitWithServicesWithProceduresWithStockAllowances[];
} & DatesRange;

const AppBarChart = (props: AppBarChartProps) => {
  const { visitData, from, to } = props;
  const intl = useIntl();
  const { costs, profit, labels } = getCostsProfitRevenue(visitData, {
    from: from.toDate(),
    to: to.toDate(),
  });
  const [selectedDay, setSelectedDay] = useState<RevenueStatistic | null>(null);

  return (
    <>
      {selectedDay && <RevenuCard selectedDay={selectedDay} />}
      <BarChart
        height={260}
        xAxis={[{ scaleType: 'band', data: labels }]}
        series={[
          {
            data: costs,
            label: intl.formatMessage({
              defaultMessage: 'Náklady',
              id: 'appBarChart.costs',
            }),
            valueFormatter: value => `${value ? Math.round(value) : 0} Kč`,
            color: AppTheme.palette.error.main,
            stack: 'finance',
          },
          {
            data: profit,
            valueFormatter: value => `${value ? Math.round(value) : 0} Kč`,
            label: intl.formatMessage({
              defaultMessage: 'Zisk',
              id: 'appBarChart.revenue',
            }),
            color: AppTheme.palette.success.main,
            stack: 'finance',
          },
        ]}
        margin={{ top: 20, bottom: 20, left: 0, right: 20 }}
        onItemClick={(_, item) => {
          const profitAmount = profit[item.dataIndex];
          const costsAmount = costs[item.dataIndex];
          const revenue = costsAmount + profitAmount;
          const label = labels[item.dataIndex];

          setSelectedDay({
            profit: profitAmount,
            costs: costsAmount,
            revenue,
            label,
          });
        }}
        barLabel={(item, context) => (context.bar.height > 30 ? `${item.value} Kč` : null)}
      />
    </>
  );
};

export default AppBarChart;
