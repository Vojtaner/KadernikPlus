import Loader from '../../pages/Loader'
import { type Control, type FieldPath, type FieldPathValue, type FieldValues } from 'react-hook-form'
import AutoComplete from '../../../app/components/AutoComplete'
import { useClientsQuery } from '../queries'
import { useIntl } from 'react-intl'

type ClientsAutoCompleteProps<TFieldValues extends FieldValues> = {
  fieldPath: FieldPath<TFieldValues>
  control: Control<TFieldValues>
  defaultValue?: FieldPathValue<TFieldValues, FieldPath<TFieldValues>>
  required?: boolean
}

const ClientAutoComplete = <TFieldValues extends FieldValues>({
  control,
  fieldPath,
  defaultValue,
  required,
}: ClientsAutoCompleteProps<TFieldValues>) => {
  const { data: clients } = useClientsQuery()
  const intl = useIntl()

  if (!clients) {
    return <Loader />
  }

  const options = clients.map((c) => ({
    id: c.id,
    firstName: c.firstName,
    lastName: c.lastName,
    name: `${c.firstName && c.firstName !== '-' ? c.firstName : ''} ${c.lastName}`.trim(),
  }))

  return (
    <AutoComplete
      options={options}
      control={control}
      fieldPath={fieldPath}
      defaultValue={defaultValue}
      required={required}
      getOptionLabel={(o) => o.name}
      getOptionValue={(o) => o.id}
      label={intl.formatMessage({
        id: 'clientAutoComplete.selectClient',
        defaultMessage: 'Vyberte klienta',
      })}
      placeholder={intl.formatMessage({
        id: 'clientAutoComplete.searchPlaceholder',
        defaultMessage: 'Hledejte...',
      })}
    />
  )
}

export default ClientAutoComplete
