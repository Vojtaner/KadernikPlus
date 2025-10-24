import { Grid } from '@mui/material';
import DetailColumn from '../../../app/components/DetailColumn';
import { formatToCZK } from '../../visits/components/VisitDetailGrid';
import type { ClientWithVisits } from '../../../entities/client';
import Note from '../../../app/components/Note';
import RedSwitch from '../../../app/components/Switch/RedSwitch';
import { useCreateNewOrUpdateClientMutation } from '../queries';
import { useIntl } from 'react-intl';
type ClientProfileGridProps = {
  clientData: ClientWithVisits;
};

const ClientProfileGrid = (props: ClientProfileGridProps) => {
  const { clientData } = props;
  const earnedMoneyPerClient = clientData.visits.reduce(
    (prev, curr) => prev + Number(curr.paidPrice),
    0,
  );
  const visitCount = clientData.visits.length;
  const { mutate: changeClientDepositStatus } = useCreateNewOrUpdateClientMutation();
  const intl = useIntl();

  return (
    <Grid container rowSpacing={2}>
      <Grid size={4} padding={0}>
        <DetailColumn
          label={intl.formatMessage({
            defaultMessage: 'Jméno a příjmení',
            id: 'clientProfile.fullName',
          })}
          input={`${clientData.firstName} ${clientData.lastName}`}
        />
      </Grid>
      <Grid size={4}>
        <DetailColumn
          label={intl.formatMessage({ defaultMessage: 'Telefon', id: 'clientProfile.phone' })}
          input={clientData.phone}
        />
      </Grid>
      <Grid size={4}>
        <DetailColumn
          label={intl.formatMessage({
            defaultMessage: 'Tržby celkem',
            id: 'clientProfile.totalRevenue',
          })}
          input={formatToCZK(earnedMoneyPerClient)}
        />
      </Grid>
      <Grid size={4}>
        <DetailColumn
          label={intl.formatMessage({
            defaultMessage: 'Návštěvy celkem',
            id: 'clientProfile.totalVisits',
          })}
          input={visitCount}
        />
      </Grid>
      <Grid size={4} alignContent="center" justifyContent="center">
        <Note
          note={clientData.note}
          label={intl.formatMessage({
            defaultMessage: 'Informace o zákazníkovi',
            id: 'clientProfile.clientInfo',
          })}
        />
      </Grid>
      <Grid size={4} alignContent="center" justifyContent="center">
        <DetailColumn
          label={intl.formatMessage({
            defaultMessage: 'Platí zálohy',
            id: 'clientProfile.depositRequirement',
          })}
          input={
            <RedSwitch
              checked={clientData.deposit}
              onSubmitEndpoint={checked => {
                changeClientDepositStatus({ deposit: checked, id: clientData.id });
              }}
            />
          }
        />
      </Grid>
    </Grid>
  );
};

export default ClientProfileGrid;
