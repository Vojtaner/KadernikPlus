import Loader from '../../pages/Loader'
import { type Control, type FieldPath, type FieldValues } from 'react-hook-form'
import { useClientsQuery } from '../../queries'
import AutoComplete from '../../app/components/AutoComplete'

type ClientsAutoCompleteProps<TFieldValues extends FieldValues> = {
  fieldPath: FieldPath<TFieldValues>
  control: Control<TFieldValues>
}

const ClientAutoComplete = <TFieldValues extends FieldValues>(props: ClientsAutoCompleteProps<TFieldValues>) => {
  const { control, fieldPath } = props
  const { data: clients } = useClientsQuery()

  if (!clients) {
    return <Loader />
  }

  const options = clients.map((client) => ({ id: client.id, name: `${client.firstName} ${client.lastName}` }))

  return <AutoComplete options={options} control={control} fieldPath={fieldPath} label="Vyberte klienta" />
}

export default ClientAutoComplete
