import { Stack } from '@mui/material';
import dayjs from 'dayjs';
import Loader from './Loader';
import { useAppForm } from '../reactHookForm/store';
import AppBarChart from '../hairdresser/components/BarChart';
import { usePersistentFilters } from '../hooks';
import { BasicDatePicker } from '../app/components/BasicDatePicker';
import { useVisitsQuery } from '../hairdresser/visits/queries';
import { useIntl } from 'react-intl';

const RevenuChart = () => {
  const [filters, updateFilter] = usePersistentFilters();
  const intl = useIntl();
  const {
    revenue: {
      dates: { from, to },
    },
  } = filters;

  const dayjsFrom = dayjs(from);
  const dayjsTo = dayjs(to);

  const { control } = useAppForm({
    defaultValues: {
      from: dayjsFrom,
      to: dayjsTo,
    },
  });

  const { data: visitData } = useVisitsQuery({ query: { from: dayjsFrom, to: dayjsTo } });

  if (!visitData) {
    return <Loader />;
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2}>
        <BasicDatePicker
          label={intl.formatMessage({ id: 'revenueChart.dateFrom', defaultMessage: 'Datum od' })}
          control={control}
          fieldPath="from"
          onChange={date => {
            updateFilter(draft => {
              draft.revenue.dates.from = date?.toISOString();
            });
          }}
        />
        <BasicDatePicker
          label={intl.formatMessage({ id: 'revenueChart.dateTo', defaultMessage: 'Datum do' })}
          control={control}
          fieldPath="to"
          onChange={date => {
            updateFilter(draft => {
              draft.revenue.dates.to = date?.toISOString();
            });
          }}
        />
      </Stack>
      <AppBarChart visitData={visitData} from={dayjsFrom} to={dayjsTo} />
    </Stack>
  );
};

export default RevenuChart;
