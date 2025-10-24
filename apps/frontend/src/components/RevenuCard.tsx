import { Card, CardContent, Divider, Stack, Typography } from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EventIcon from '@mui/icons-material/Event';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import ControlPointIcon from '@mui/icons-material/ControlPoint';

type RevenuCardProps = {
  selectedDay: RevenueStatistic;
};

export type RevenueStatistic = {
  profit: number;
  costs: number;
  revenue: number;
  label: string;
};

const RevenuCard = (props: RevenuCardProps) => {
  const { selectedDay } = props;

  return (
    <Card
      sx={{
        minWidth: 320,
        borderRadius: 3,
        boxShadow: 2,
        bgcolor: '#f6f4ef',
        px: 2,
        py: 1,
      }}
    >
      <CardContent sx={{ p: 1, '&:last-child': { pb: 1 } }}>
        <Stack spacing={1.2}>
          <Stack direction="row" spacing={3} justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center">
              <EventIcon color="info" fontSize="small" />
              <Typography variant="subtitle2" fontWeight="bold">
                {selectedDay.label}
              </Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <TrendingUpIcon fontSize="small" color="success" />
              <Typography variant="body2" fontWeight="bold">
                Zisk: {selectedDay.profit} Kč
              </Typography>
            </Stack>
          </Stack>
          <Divider />
          <Stack direction="row" spacing={3} justifyContent="space-between">
            <Stack direction="row" spacing={1} alignItems="center">
              <RemoveCircleOutlineIcon fontSize="small" color="error" />
              <Typography variant="body2">Náklady: {selectedDay.costs} Kč</Typography>
            </Stack>
            <Stack direction="row" spacing={1} alignItems="center">
              <ControlPointIcon fontSize="small" color="success" />
              <Typography variant="body2">Tržba: {selectedDay.revenue} Kč</Typography>
            </Stack>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default RevenuCard;
