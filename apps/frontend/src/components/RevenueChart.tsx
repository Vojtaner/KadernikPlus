import { Stack } from '@mui/material'
import dayjs from 'dayjs'
import Loader from '../pages/Loader'
import { useVisitsQuery } from '../queries'
import { useAppForm } from '../reactHookForm/store'
import AppBarChart from './BarChart'
import { BasicDatePicker } from './DateTimePicker'
import { usePersistentFilters } from '../hooks'

const RevenuChart = () => {
  const [filters, updateFilter] = usePersistentFilters()
  const {
    revenue: {
      dates: { from, to },
    },
  } = filters

  const dayjsFrom = dayjs(from)
  const dayjsTo = dayjs(to)

  const { control } = useAppForm({
    defaultValues: {
      from: dayjsFrom,
      to: dayjsTo,
    },
  })

  const { data: visitData } = useVisitsQuery({ query: { from: dayjsFrom, to: dayjsTo } })

  if (!visitData) {
    return <Loader />
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2}>
        <BasicDatePicker
          label="Datum od"
          control={control}
          fieldPath="from"
          onChange={(date) => {
            updateFilter((draft) => {
              draft.revenue.dates.from = date?.toISOString()
            })
          }}
        />
        <BasicDatePicker
          label="Datum do"
          control={control}
          fieldPath="to"
          maxDate={dayjsTo}
          onChange={(date) => {
            updateFilter((draft) => {
              draft.revenue.dates.to = date?.toISOString()
            })
          }}
        />
      </Stack>
      <AppBarChart visitData={visitData} from={dayjsFrom} to={dayjsTo} />
    </Stack>
  )
}

export default RevenuChart
