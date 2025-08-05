import { Autocomplete, TextField } from '@mui/material'
import { useServicesQuery } from '../../queries'
import Loader from '../../pages/Loader'
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'

// const services = [
//   { id: '1', serviceName: 'Stříhání na sucho' },
//   { id: '2', serviceName: 'Baleage' },
//   { id: '3', serviceName: 'Trvalá' },
//   { id: '4', serviceName: 'Odbarvení blond' },
// ]

//udělat jediný autocomplete v budoucnu otypovat

type HairCutAutoCompleteProps<TFieldValues extends FieldValues> = {
  fieldPath: FieldPath<TFieldValues>
  control: Control<TFieldValues>
}
function HairCutAutoComplete<TFieldValues extends FieldValues>(props: HairCutAutoCompleteProps<TFieldValues>) {
  const { fieldPath, control } = props
  const { data: services } = useServicesQuery()

  if (!services) {
    return <Loader />
  }

  return (
    <Controller
      name={fieldPath}
      control={control}
      render={({ field }) => (
        <Autocomplete
          options={services}
          getOptionLabel={(service) => service.serviceName}
          onChange={(_, selectedService) => field.onChange([selectedService?.id])}
          renderInput={(params) => <TextField {...params} {...field} label="Vyberte službu" />}
        />
      )}
    />
  )
}

export default HairCutAutoComplete
