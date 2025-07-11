import { Autocomplete } from '@mui/material'
import TextField from './TextField'

const options = ['Stříhání na sucho', 'Baleage', 'Trvalá', 'Odbarvení blond']

//udělat jediný autocomplete v budoucnu otypovat
function HairCutAutoComplete() {
  return (
    <Autocomplete
      options={options}
      renderInput={(params) => <TextField {...params} fieldPath="newVisitHairCut" label="Vyberte účes" />}
    />
  )
}

export default HairCutAutoComplete
