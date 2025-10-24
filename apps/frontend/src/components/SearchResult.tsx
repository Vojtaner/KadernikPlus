import { IconButton, Stack, Typography, type SxProps } from '@mui/material';
import PermIdentityIcon from '@mui/icons-material/PermIdentity';
import type { ClientWithVisitsWithVisitServices, ReturnedClientVisit } from '../entities/client';
import { Paths } from '../routes/AppRoutes';
import { useAppNavigate } from '../hooks';
import { useIntl } from 'react-intl';
import { useAppDispatch } from '../store/store';
import { setSearchState } from '../store/appUiSlice';
import { getDateTimeFromUtcToLocal } from '../hairdresser/visits/entity';

type SearchResultProps = {
  clientData: ClientWithVisitsWithVisitServices;
  sx?: SxProps;
};

const SearchResult = (props: SearchResultProps) => {
  const { sx, clientData } = props;
  const dispatch = useAppDispatch();
  const navigate = useAppNavigate();
  const intl = useIntl();

  const latestVisit = getLatestVisit(clientData.visits);

  return (
    <Stack
      marginY="5px"
      direction="row"
      alignItems="center"
      justifyContent="flex-start"
      spacing={1}
      sx={{
        cursor: 'pointer',
        textDecoration: 'none',
        color: 'inherit',
        ...sx,
      }}
      component="a"
      onClick={() => {
        dispatch(setSearchState(false));
        navigate(Paths.clientDetail(clientData.id));
      }}
    >
      <IconButton>
        <PermIdentityIcon fontSize="large" />
      </IconButton>
      <Stack justifyContent="center" height="100%">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography fontWeight={600} color="text.primary" fontSize="1rem">
            {`${clientData.firstName} ${clientData.lastName}`}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            {latestVisit?.visitServices[0].service.serviceName}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" color="info.main" fontSize="0.7rem">
            {clientData.deposit
              ? latestVisit?.depositStatus?.toUpperCase()
              : intl.formatMessage({
                  defaultMessage: 'NEPLATÍ ZÁLOHY',
                  id: 'searchResult.NoDeposit',
                })}
          </Typography>
          <Typography variant="h6" color="info.main" fontSize="0.7rem">
            -
          </Typography>
          <Typography variant="caption" color="#ff6221" alignItems="center">
            {latestVisit?.date && getDateTimeFromUtcToLocal(latestVisit?.date)}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};

export default SearchResult;

const getLatestVisit = (visits: ReturnedClientVisit[]): ReturnedClientVisit | undefined => {
  if (!visits.length) {
    return undefined;
  }

  return visits.reduce((latest, current) => {
    return new Date(current.date) > new Date(latest.date) ? current : latest;
  });
};
