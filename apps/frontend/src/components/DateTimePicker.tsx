// import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs from 'dayjs'
import 'dayjs/locale/cs'

dayjs.locale('cs')

export default function BasicDateTimePicker() {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="cs">
      {/* <DemoContainer components={['DateTimePicker']}> */}
      <DateTimePicker label="Datum" ampm={false} />
      {/* </DemoContainer> */}
    </LocalizationProvider>
  )
}
