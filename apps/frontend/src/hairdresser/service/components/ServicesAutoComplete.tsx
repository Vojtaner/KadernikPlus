import type { Control, FieldPath, FieldValues } from 'react-hook-form';
import { FormattedMessage, useIntl } from 'react-intl';
import { useParams } from 'react-router-dom';
import AutoComplete from '../../../app/components/AutoComplete';
import Loader from '../../../components/Loader';
import { queryClient } from '../../../reactQuery/reactTanstackQuerySetup';
import { useServicesQuery } from '../queries';
import { getVisitByIdQueryKey } from '../../visits/queries';

type ServicesAutoCompleteProps<TFieldValues extends FieldValues> = {
  fieldPath: FieldPath<TFieldValues>;
  control: Control<TFieldValues>;
  disabled?: boolean;
};

const ServicesAutoComplete = <TFieldValues extends FieldValues>(
  props: ServicesAutoCompleteProps<TFieldValues>
) => {
  const { control, fieldPath, disabled } = props;
  const { data: services, isLoading } = useServicesQuery();
  const { visitId } = useParams();
  const intl = useIntl();

  if (!services && isLoading) {
    return <Loader />;
  }
  if (!services) {
    return (
      <FormattedMessage defaultMessage="Služby se nepodařilo načíst." id="services.notFound" />
    );
  }

  const options = services.map(service => ({ id: service.id, name: service.serviceName }));

  return (
    <AutoComplete
      options={options}
      getOptionLabel={o => o.name}
      getOptionValue={o => o.id}
      required={true}
      control={control}
      fieldPath={fieldPath}
      disabled={disabled}
      label={intl.formatMessage({
        id: 'services.chooseService',
        defaultMessage: 'Vyberte službu',
      })}
      placeholder={intl.formatMessage({
        id: 'services.search',
        defaultMessage: 'Hledejte...',
      })}
      onChange={() => {
        queryClient.invalidateQueries({ queryKey: getVisitByIdQueryKey(visitId) });
      }}
    />
  );
};

export default ServicesAutoComplete;
