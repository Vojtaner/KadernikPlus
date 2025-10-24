import { Stack, Typography } from '@mui/material';
import type { UserLog } from '../api/entity';

type LogLineProps = Omit<UserLog, 'id' | 'actionType'>;

export const LogLine = (props: LogLineProps) => {
  const { dateTime, description, userName } = props;

  return (
    <Stack
      marginY="5px"
      direction="row"
      alignItems="center"
      borderLeft="1px solid red"
      justifyContent="flex-start"
      paddingLeft={1}
    >
      <Stack height="100%">
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography fontWeight={600} color="text.primary" fontSize="0.8rem">
            {userName}
          </Typography>
          {/* <Typography variant="caption" color="text.secondary" fontSize={'0.6rem'}>
            {actionType.toUpperCase()}
          </Typography> */}
          <Typography variant="h6" color="info.main" fontSize="0.7rem">
            -
          </Typography>
          <Typography variant="caption" color="#ff6221" alignItems="center">
            {dateTime.format('DD.MM.YYYY - HH:mm')}
          </Typography>
        </Stack>
        <Stack direction="row" alignItems="center" spacing={1}>
          <Typography variant="h6" color="info.main" fontSize="0.7rem">
            {description.toUpperCase()}
          </Typography>
        </Stack>
      </Stack>
    </Stack>
  );
};
