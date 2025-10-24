import { Stack } from '@mui/material';
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined';
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import DashBoardCard from '../../app/components/DashBoardCard';
import ShoppingList from './ShoppingList';
import NewReleasesIcon from '@mui/icons-material/NewReleases';
import VisitsList from '../visits/components/VisitsList';
import RevenuChart from '../../components/RevenueChart';
import { useIntl } from 'react-intl';

export const Dashboard = () => {
  const intl = useIntl();

  return (
    <Stack direction="column" rowGap={5}>
      <DashBoardCard
        title={intl.formatMessage({
          id: 'dashboard.visitsOverview',
          defaultMessage: 'Přehled návštěv',
        })}
        icon={<PhotoCameraFrontOutlinedIcon fontSize="medium" color="secondary" />}
      >
        <VisitsList
          columnHeaderHeight={0}
          hideFooter={true}
          enableFilters={false}
          visitListApplyFilter="dashBoardVisitOverView"
        />
      </DashBoardCard>
      <DashBoardCard
        title={intl.formatMessage({
          id: 'dashboard.shoppingList',
          defaultMessage: 'Nákupní seznam',
        })}
        icon={<AddShoppingCartOutlinedIcon fontSize="medium" color="secondary" />}
      >
        <ShoppingList columnHeaderHeight={0} hideFooter={true} />
      </DashBoardCard>
      <DashBoardCard
        title={intl.formatMessage({
          id: 'dashboard.unclosedVisits',
          defaultMessage: 'Neuzavřené návštěvy',
        })}
        icon={<NewReleasesIcon fontSize="medium" color="secondary" />}
      >
        <VisitsList
          columnHeaderHeight={0}
          hideFooter={true}
          visitListApplyFilter="onlyOpenVisits"
          enableFilters={false}
        />
      </DashBoardCard>
      <DashBoardCard
        sx={{ height: 'auto' }}
        title={intl.formatMessage({ id: 'dashboard.revenue', defaultMessage: 'Tržby' })}
        icon={<BarChartOutlinedIcon fontSize="medium" color="secondary" />}
      >
        <RevenuChart />
      </DashBoardCard>
    </Stack>
  );
};
