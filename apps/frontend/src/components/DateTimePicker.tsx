// import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker'
import dayjs from 'dayjs'
import 'dayjs/locale/cs'
import { Controller, type Control } from 'react-hook-form'
import type { AppFieldPath, AppFormState } from '../reactHookForm/entity'

dayjs.locale('cs')

type DatePickerProps = {
  control: Control<AppFormState> // or better: `Control<any>` from RHF
  label?: string
  fieldPath: AppFieldPath
  defaultValue?: Date
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
