import {
  Controller,
  type Control,
  type FieldPath,
  type FieldPathValue,
  type FieldValues,
} from 'react-hook-form';
import { FormControl, InputLabel, MenuItem, Select, type SxProps, type Theme } from '@mui/material';

export type Identifiable = {
  id: string | number;
  name: string;
};

type SelectFieldProps<T extends Identifiable, TFieldValues extends FieldValues> = {
  control: Control<TFieldValues>;
  fieldPath: FieldPath<TFieldValues>;
  sx?: SxProps<Theme>;
  items: T[];
  keyExtractor: (item: T) => T['id'];
  labelExtractor: (item: T) => string;
  defaultValue?: FieldPathValue<TFieldValues, FieldPath<TFieldValues>>;
  label: string;
  disabled?: boolean;
};

const SelectField = <T extends Identifiable, TFieldValues extends FieldValues>(
  props: SelectFieldProps<T, TFieldValues>,
) => {
  return (
    <Controller
      name={props.fieldPath}
      control={props.control}
      defaultValue={props.defaultValue}
      render={({ field }) => (
        <FormControl fullWidth sx={props.sx} disabled={props.disabled}>
          <InputLabel id={props.label}>{props.label}</InputLabel>
          <Select {...field} label={props.label}>
            {props.items.map(item => (
              <MenuItem key={props.keyExtractor(item)} value={props.keyExtractor(item)}>
                {props.labelExtractor(item)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}
    />
  );
};

export default SelectField;
