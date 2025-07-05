import { FormControl, InputLabel, MenuItem, OutlinedInput, Select, type SxProps, type Theme } from '@mui/material'

type Identifiable = {
  id: string | number
  name: string
}

type SelectFieldProps<T extends Identifiable> = {
  items: T[]
  value: T['id']
  onChange: (value: T['id']) => void
  keyExtractor: (item: T) => T['id']
  labelExtractor: (item: T) => string
  sx?: SxProps<Theme>
}

const SelectField = <T extends Identifiable>({
  items,
  keyExtractor,
  labelExtractor,
  value,
  onChange,
  sx,
}: SelectFieldProps<T>) => {
  return (
    <FormControl>
      <InputLabel id="demo-multiple-name-label">Jednotka</InputLabel>
      <Select
        input={<OutlinedInput label="Jednotka" />}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        sx={sx}>
        {items.map((item) => (
          <MenuItem key={keyExtractor(item)} value={keyExtractor(item)}>
            {labelExtractor(item)}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  )
}

export default SelectField
