// import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker, DatePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/cs'
import { Controller, type Control } from 'react-hook-form'
import type { AppFieldPath, AppFormState } from '../reactHookForm/entity'
import type { PickerValue } from '@mui/x-date-pickers/internals'

dayjs.locale('cs')

type DatePickerProps = {
  control: Control<AppFormState> // or better: `Control<any>` from RHF
  label?: string
  fieldPath: AppFieldPath
  defaultValue?: Dayjs
  minDate?: Dayjs
  maxDate?: Dayjs
}

export default function BasicDateTimePicker({ fieldPath, control, label, defaultValue }: DatePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="cs">
      <Controller
        name={fieldPath}
        control={control}
        render={({ field }) => (
          <DateTimePicker
            label={label ?? 'Datum'}
            ampm={false}
            value={isStringNumberOrDate(field.value) ? dayjs(field.value) : (dayjs(defaultValue) ?? null)}
            onChange={(date) => field.onChange(date?.toDate())}
            slotProps={{ textField: { fullWidth: true } }}
          />
        )}
      />
    </LocalizationProvider>
  )
}
export function BasicDatePicker({ fieldPath, control, label, defaultValue, minDate, maxDate }: DatePickerProps) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="cs">
      <Controller
        name={fieldPath}
        control={control}
        render={({ field }) => (
          <DatePicker
            label={label ?? 'Datum'}
            value={field.value ? dayjs(field.value) : defaultValue ? dayjs(defaultValue) : null}
            onChange={(date) => field.onChange(date)}
            slotProps={{ textField: { fullWidth: true } }}
            minDate={minDate}
            maxDate={maxDate}
            onAccept={(date: PickerValue) => console.log(date && date.format('YYYY-MM-DD'))}
          />
        )}
      />
    </LocalizationProvider>
  )
}

export function isString(value: unknown): value is string {
  return typeof value === 'string'
}

export function isNumber(value: unknown): value is number {
  return typeof value === 'number' && !isNaN(value)
}

export function isDate(value: unknown): value is Date {
  return value instanceof Date && !isNaN(value.getTime())
}

export function isStringNumberOrDate(value: unknown): value is string | number | Date {
  return isString(value) || isNumber(value) || isDate(value)
}
