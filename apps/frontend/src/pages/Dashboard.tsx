import { Stack } from '@mui/material'
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import VisitsList from '../domains/visits/VisitsList'
import DashBoardCard from '../app/components/DashBoardCard'
import RevenuChart from '../components/RevenueChart'
import ShoppingList from './ShoppingList'
import NewReleasesIcon from '@mui/icons-material/NewReleases'

export const Dashboard = () => {
  return (
    <Stack direction="column" rowGap={5}>
      <DashBoardCard
        title="Přehled návštěv"
        icon={<PhotoCameraFrontOutlinedIcon fontSize="medium" color="secondary" />}>
        <VisitsList
          columnHeaderHeight={0}
          hideFooter={true}
          enableFilters={false}
          visitListApplyFilter="dashBoardVisitOverView"
        />
      </DashBoardCard>

      <DashBoardCard title="Nákupní seznam" icon={<AddShoppingCartOutlinedIcon fontSize="medium" color="secondary" />}>
        <ShoppingList columnHeaderHeight={0} hideFooter={true} />
      </DashBoardCard>
      <DashBoardCard title="Neuzavřené návštěvy" icon={<NewReleasesIcon fontSize="medium" color="secondary" />}>
        <VisitsList
          columnHeaderHeight={0}
          hideFooter={true}
          visitListApplyFilter="onlyOpenVisits"
          enableFilters={false}
        />
      </DashBoardCard>
      <DashBoardCard
        sx={{ height: 'auto' }}
        title="Tržby"
        icon={<BarChartOutlinedIcon fontSize="medium" color="secondary" />}>
        <RevenuChart />
      </DashBoardCard>
    </Stack>
  )
}
