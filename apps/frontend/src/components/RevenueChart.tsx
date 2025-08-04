import { Stack } from '@mui/material'
import dayjs from 'dayjs'
import Loader from '../pages/Loader'
import { useVisitsQuery } from '../queries'
import { useAppForm } from '../reactHookForm/store'
import AppBarChart from './BarChart'
import { BasicDatePicker } from './DateTimePicker'

const RevenuChart = () => {
  const { control, watch } = useAppForm({
    defaultValues: {
      from: dayjs().subtract(7, 'day'),
      to: dayjs(),
    },
  })

  const fromDate = watch('from')
  const toDate = watch('to')

  const { data: visitData } = useVisitsQuery({ from: fromDate, to: toDate })

  if (!visitData) {
    return <Loader />
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={2}>
        <BasicDatePicker label="Datum od" control={control} fieldPath="from" />
        <BasicDatePicker label="Datum do" control={control} fieldPath="to" maxDate={dayjs()} />
      </Stack>
      <AppBarChart visitData={visitData} from={fromDate} to={toDate} />
    </Stack>
  )
}

export default RevenuChart
