// import { DemoContainer } from '@mui/x-date-pickers/internals/demo'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import {
  DateTimePicker,
  DatePicker,
  type DateValidationError,
  type PickerChangeHandlerContext,
} from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import 'dayjs/locale/cs'
import { Controller, type Control, type FieldPath, type FieldValues, type RegisterOptions } from 'react-hook-form'
import type { PickerValue } from '@mui/x-date-pickers/internals'

dayjs.locale('cs')

type DatePickerProps<TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>
  label?: string
  fieldPath: FieldPath<TFieldValues>
  defaultValue?: Dayjs
  minDate?: Dayjs
  maxDate?: Dayjs
  rules?: RegisterOptions<TFieldValues, FieldPath<TFieldValues>>
  onChange?: ((value: PickerValue, context: PickerChangeHandlerContext<DateValidationError>) => void) | undefined
}

export default function BasicDateTimePicker<TFieldValues extends FieldValues>({
  fieldPath,
  control,
  label,
  rules,
}: DatePickerProps<TFieldValues>) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="cs">
      <Controller
        name={fieldPath}
        control={control}
        rules={rules}
        render={({ field, fieldState: { error } }) => (
          <DateTimePicker
            {...field}
            label={label ?? 'Datum'}
            ampm={false}
            value={dayjs(field.value)}
            onChange={(date) => field.onChange(date?.toDate())}
            slotProps={{
              textField: {
                fullWidth: true,
                error: !!error,
                helperText: error?.message,
              },
            }}
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
  onChange,
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
            onChange={(date, context) => {
              field.onChange(date)
              onChange?.(date, context)
            }}
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
