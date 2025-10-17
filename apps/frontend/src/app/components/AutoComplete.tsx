import { Autocomplete, TextField } from '@mui/material'
import { Controller, type Control, type FieldPath, type FieldPathValue, type FieldValues } from 'react-hook-form'
import type { SyntheticEvent } from 'react'
import type { Identifiable } from './SelectField'

type AutoCompleteProps<TFieldValues extends FieldValues, TOption extends object> = {
  fieldPath: FieldPath<TFieldValues>
  control: Control<TFieldValues>
  options: TOption[]
  label: string
  getOptionLabel: (option: TOption) => string
  getOptionValue: (option: TOption) => string | number
  onChange?: (event: SyntheticEvent) => void
  defaultValue?: FieldPathValue<TFieldValues, FieldPath<TFieldValues>>
  placeholder?: string
  disabled?: boolean
  required?: boolean
}

function AutoComplete<TFieldValues extends FieldValues, TOption extends object>({
  fieldPath,
  control,
  options,
  label,
  getOptionLabel,
  getOptionValue,
  onChange,
  defaultValue,
  placeholder,
  disabled,
  required,
}: AutoCompleteProps<TFieldValues, TOption>) {
  const labelFn = getOptionLabel ?? ((opt: Identifiable) => opt?.name ?? '')

  const valueFn = getOptionValue ?? ((opt: Identifiable) => opt?.id ?? '')

  return (
    <Controller
      name={fieldPath}
      control={control}
      defaultValue={defaultValue}
      rules={required ? { required: 'Toto pole je povinné' } : undefined}
      render={({ field, fieldState }) => {
        const selected = options.find((opt) => valueFn(opt) === field.value) ?? null

        return (
          <Autocomplete
            noOptionsText="Žádné možnosti"
            options={options}
            disabled={disabled}
            renderOption={(props, option) => (
              <li {...props} key={valueFn(option)}>
                {labelFn(option)}
              </li>
            )}
            value={selected}
            getOptionLabel={labelFn}
            isOptionEqualToValue={(opt, val) => valueFn(opt) === valueFn(val)}
            onChange={(e, option) => {
              onChange?.(e)
              field.onChange(option ? valueFn(option) : null)
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={label}
                placeholder={placeholder}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
              />
            )}
          />
        )
      }}
    />
  )
}

export default AutoComplete
