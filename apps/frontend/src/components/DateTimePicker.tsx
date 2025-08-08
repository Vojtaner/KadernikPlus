// import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker, DatePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/cs'
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

dayjs.locale('cs')

type DatePickerProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  label?: string
  fieldPath: FieldPath<TFieldValues>
  defaultValue?: Dayjs
  minDate?: Dayjs
  maxDate?: Dayjs
}

export default function BasicDateTimePicker<TFieldValues extends FieldValues>({
  fieldPath,
  control,
  label,
}: DatePickerProps<TFieldValues>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="cs">
      <Controller
        name={fieldPath}
        control={control}
        render={({ field }) => (
          <DateTimePicker
            {...field}
            label={label ?? 'Datum'}
            ampm={false}
            value={dayjs(field.value)}
            onChange={(date) => field.onChange(date?.toDate())}
            slotProps={{ textField: { fullWidth: true } }}
          />
        )}
      />
    </LocalizationProvider>
  )
}
export function BasicDatePicker<TFieldValues extends FieldValues>({
  fieldPath,
  control,
  label,
  defaultValue,
  minDate,
  maxDate,
}: DatePickerProps<TFieldValues>) {
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
            slotProps={{ textField: { fullWidth: true, sx: { zIndex: '0' } } }}
            minDate={minDate}
            maxDate={maxDate}
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
