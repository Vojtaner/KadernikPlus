import { Switch as MuiSwitch, type SwitchProps as MuiSwitchProps } from '@mui/material'

type SwitchProps = MuiSwitchProps & {
  onSubmitEndpoint: (checked: boolean) => void
}

const Switch = (props: SwitchProps) => {
  const { onSubmitEndpoint, onChange, ...muiProps } = props

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const checked = event.target.checked

    onSubmitEndpoint(checked)

    onChange?.(event, checked)
  }

  return <MuiSwitch {...muiProps} onChange={handleChange} />
}

export default Switch
