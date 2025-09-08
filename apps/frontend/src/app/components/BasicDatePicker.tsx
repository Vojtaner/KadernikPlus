import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import 'dayjs/locale/cs'
import { Controller, type FieldValues } from 'react-hook-form'
import type { DatePickerProps } from './BasicDateTimePicker'

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
