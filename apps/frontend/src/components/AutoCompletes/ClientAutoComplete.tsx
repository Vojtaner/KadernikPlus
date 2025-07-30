import { Autocomplete, TextField } from '@mui/material'
import Loader from '../../pages/Loader'
import { Controller, type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { useClientsQuery } from '../../queries'

// const clients = [
//   { id: '1', firstName: 'Jana', lastName: 'Morečková' },
//   { id: '2', firstName: 'Magdaléna', lastName: 'Suchá' },
//   { id: '3', firstName: 'Honza', lastName: 'Navrátil' },
//   { id: '4', firstName: 'Ludmila', lastName: 'Křížová' },
// ]

type ClientsAutoCompleteProps<TFieldValues extends FieldValues> = {
  fieldPath: FieldPath<TFieldValues>
  control: Control<TFieldValues>
}

export default function ClientAutoComplete<TFieldValues extends FieldValues>({
  fieldPath,
  control,
}: ClientsAutoCompleteProps<TFieldValues>) {
  const { data: clients } = useClientsQuery()

  if (!clients) {
    return <Loader />
  }

  return (
    <Controller
      name={fieldPath}
      control={control}
      render={({ field }) => (
        <Autocomplete
          options={clients}
          getOptionLabel={(client) => `${client.firstName} ${client.lastName}`}
          value={clients.find((client) => client.id === field.value) || null}
          onChange={(_, selectedClient) => {
            field.onChange(selectedClient?.id ?? null)
          }}
          renderInput={(params) => <TextField {...params} label="Vyberte klienta" />}
          isOptionEqualToValue={(option, value) => option.id === value.id}
        />
      )}
    />
  )
}

// vytovření návštěvy
// nejdříve jen mokovací data
//následně načítat data
