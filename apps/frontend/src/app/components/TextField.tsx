import {
  Controller,
  get,
  useFormState,
  type Control,
  type FieldPath,
  type FieldPathValue,
  type FieldValues,
  type RegisterOptions,
} from 'react-hook-form'
import { TextField as MuiTextField, type TextFieldProps as MuiTextFieldProps } from '@mui/material'

export type TextFieldProps<TFieldValues extends FieldValues = FieldValues> =
  | ({
      readonly: true
      defaultValue?: FieldPathValue<TFieldValues, FieldPath<TFieldValues>>
      disabled?: boolean

      control?: never
      rules?: never
    } & Omit<MuiTextFieldProps, 'name' | 'value' | 'onChange' | 'onBlur'>)
  | ({
      readonly?: false
      fieldPath: FieldPath<TFieldValues>
      control?: Control<TFieldValues>
      rules?: Omit<
        RegisterOptions<TFieldValues, FieldPath<TFieldValues>>,
        'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
      >
      defaultValue?: FieldPathValue<TFieldValues, FieldPath<TFieldValues>>
      disabled?: boolean
    } & Omit<MuiTextFieldProps, 'name' | 'value' | 'onChange' | 'onBlur'>)

function TextField<TFieldValues extends FieldValues = FieldValues>(props: TextFieldProps<TFieldValues>) {
  const { control, rules, disabled, defaultValue, readonly, ...rest } = props

  if (readonly) {
    return <MuiTextField {...rest} value={defaultValue ?? ''} disabled />
  }

  const { fieldPath, ...restUnControlledInput } = props
  const { errors } = useFormState({ control, name: fieldPath })
  const error: string = get(errors, fieldPath)?.message

  return (
    <Controller
      control={control!}
      name={fieldPath}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <MuiTextField
          {...restUnControlledInput}
          inputRef={ref}
          name={fieldPath}
          disabled={disabled}
          helperText={error}
          error={!!error}
          value={value || undefined}
          onBlur={onBlur}
          onChange={(e) => {
            const raw = e.target.value

            if (rest.type === 'number') {
              if (raw === '') {
                onChange('')
                return
              }

              const num = Number(raw)
              onChange(!isNaN(num) && num >= 0 ? num : 0)
            } else {
              onChange(raw)
            }
          }}
        />
      )}
    />
  )
}

export default TextField
