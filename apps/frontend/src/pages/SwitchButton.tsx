import { Box, Button, Switch as MuiSwitch, Tooltip, type SwitchProps as MuiSwitchProps } from '@mui/material'
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

export type SwitchProps<TFieldValues extends FieldValues = FieldValues> = MuiSwitchProps & {
  tooltip?: string
  onSubmitEndpoint?: (checked: boolean) => void
  control?: Control<TFieldValues>
  fieldPath?: FieldPath<TFieldValues>
}

const Switch = <TFieldValues extends FieldValues = FieldValues>(props: SwitchProps<TFieldValues>) => {
  const { onSubmitEndpoint, onChange, tooltip, control, fieldPath, ...muiProps } = props

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    checked: boolean,
    rhfOnChange?: (value: unknown) => void
  ) => {
    onSubmitEndpoint?.(checked)

    rhfOnChange?.(checked)

    onChange?.(event, checked)
  }

  if (control && fieldPath) {
    return (
      <Controller
        control={control}
        name={fieldPath}
        render={({ field }) => (
          <Tooltip title={tooltip}>
            <Box>
              <MuiSwitch
                {...field}
                {...muiProps}
                checked={!!field.value}
                onChange={(e, checked) => handleChange(e, checked, field.onChange)}
                required
              />
            </Box>
          </Tooltip>
        )}
      />
    )
  }

  return (
    <Tooltip title={tooltip}>
      <Button sx={{ border: 'none', boxShadow: 'none', '&:hover': { background: 'none' } }}>
        <MuiSwitch {...muiProps} onChange={handleChange} />{' '}
      </Button>
    </Tooltip>
  )
}

export default Switch
