import { Autocomplete } from '@mui/material'
import TextField from './TextField'

const options = ['Jana Morečková', 'Magdaléna Suchá', 'Honza Navrátil', 'Ludmila Křížová']

//udělat jediný autocomplete v budoucnu otypovat
export default function CustomerAutoComplete() {
  return (
    <Autocomplete
      options={options}
      renderInput={(params) => <TextField {...params} fieldPath="newVisitCustomerName" label="Vyberte klienta" />}
    />
  )
}
