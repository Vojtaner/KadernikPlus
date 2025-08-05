import { Button, Switch as MuiSwitch, Tooltip, type SwitchProps as MuiSwitchProps } from '@mui/material'

type SwitchProps = MuiSwitchProps & {
  tooltip?: string
  onSubmitEndpoint: (checked: boolean) => void
}

const Switch = (props: SwitchProps) => {
  const { onSubmitEndpoint, onChange, tooltip, ...muiProps } = props

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked

    onSubmitEndpoint(checked)

    onChange?.(event, checked)
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
