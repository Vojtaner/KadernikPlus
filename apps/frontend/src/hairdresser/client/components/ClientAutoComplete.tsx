import Loader from '../../pages/Loader'
import { type Control, type FieldPath, type FieldPathValue, type FieldValues } from 'react-hook-form'
import AutoComplete from '../../../app/components/AutoComplete'
import { useClientsQuery } from '../queries'
import { useIntl } from 'react-intl'

type ClientsAutoCompleteProps<TFieldValues extends FieldValues> = {
  fieldPath: FieldPath<TFieldValues>
  control: Control<TFieldValues>
  defaultValue?: FieldPathValue<TFieldValues, FieldPath<TFieldValues>>
}

const ClientAutoComplete = <TFieldValues extends FieldValues>(props: ClientsAutoCompleteProps<TFieldValues>) => {
  const { control, fieldPath, defaultValue } = props
  const { data: clients } = useClientsQuery()
  const intl = useIntl()

  if (!clients) {
    return <Loader />
  }

  const options = clients.map((client) => ({
    id: client.id,
    name: `${client.firstName} ${client.lastName}`,
    lastName: `${client.lastName}`,
    firstName: `${client.firstName}`,
  }))

  return (
    <AutoComplete
      options={options}
      control={control}
      fieldPath={fieldPath}
      defaultValue={defaultValue}
      label={intl.formatMessage({ id: 'clientAutoComplete.selectClient', defaultMessage: 'Vyberte klienta' })}
      placeholder={intl.formatMessage({ id: 'clientAutoComplete.searchPlaceholder', defaultMessage: 'Hledejte...' })}
    />
  )
}

export default ClientAutoComplete
