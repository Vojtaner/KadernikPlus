import type { Control, FieldPath, FieldValues } from 'react-hook-form'
import { FormattedMessage } from 'react-intl'
import { useParams } from 'react-router-dom'
import AutoComplete from '../../../app/components/AutoComplete'
import Loader from '../../../pages/Loader'
import { queryClient } from '../../../reactQuery/reactTanstackQuerySetup'
import { useServicesQuery } from '../queries'

type ServicesAutoCompleteProps<TFieldValues extends FieldValues> = {
  fieldPath: FieldPath<TFieldValues>
  control: Control<TFieldValues>
}

const ServicesAutoComplete = <TFieldValues extends FieldValues>(props: ServicesAutoCompleteProps<TFieldValues>) => {
  const { control, fieldPath } = props
  const { data: services, isLoading } = useServicesQuery()
  const { visitId } = useParams()

  if (!services && isLoading) {
    return <Loader />
  }
  if (!services) {
    return <FormattedMessage defaultMessage={'Služby se nepodařilo načíst.'} id="services.notFound" />
  }

  const options = services.map((service) => ({ id: service.id, name: service.serviceName }))

  return (
    <AutoComplete
      options={options}
      control={control}
      fieldPath={fieldPath}
      label="Vyberte službu"
      onChange={() => {
        queryClient.invalidateQueries({ queryKey: ['visit', visitId] })
      }}
    />
  )
}

export default ServicesAutoComplete
