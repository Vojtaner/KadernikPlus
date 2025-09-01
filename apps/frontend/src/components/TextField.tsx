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

export type TextFieldProps<TFieldValues extends FieldValues = FieldValues> = Omit<
  MuiTextFieldProps,
  'name' | 'defaultValue' | 'value' | 'onChange' | 'onBlur'
> & {
  fieldPath: FieldPath<TFieldValues>
  control?: Control<TFieldValues>
  rules?: Omit<
    RegisterOptions<TFieldValues, FieldPath<TFieldValues>>,
    'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'
  >
  defaultValue?: FieldPathValue<TFieldValues, FieldPath<TFieldValues>>
  disabled?: boolean
}

function TextField<TFieldValues extends FieldValues = FieldValues>(props: TextFieldProps<TFieldValues>) {
  const { fieldPath, control, rules, disabled, defaultValue, ...rest } = props
  const { errors } = useFormState({ control, name: fieldPath })

  const error: string = get(errors, fieldPath)?.message

  return (
    <Controller
      control={control}
      name={fieldPath}
      rules={rules}
      defaultValue={defaultValue}
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <MuiTextField
          {...rest}
          inputRef={ref}
          name={fieldPath}
          disabled={disabled}
          helperText={error}
          error={!!error}
          value={value}
          onBlur={onBlur}
          onChange={(e) => {
            const raw = e.target.value

            if (rest.type === 'number') {
              const num = Number(raw)

              if (!isNaN(num) && num < 0) {
                onChange(0)
              } else {
                onChange(raw === '' ? '' : num)
              }
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
