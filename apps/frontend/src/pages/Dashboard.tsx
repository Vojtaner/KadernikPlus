import { Stack } from '@mui/material'
import PhotoCameraFrontOutlinedIcon from '@mui/icons-material/PhotoCameraFrontOutlined'
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined'
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined'
import VisitsList from './VisitsList'
import DashBoardCard from '../components/DashBoardCard'
import RevenuChart from '../components/RevenueChart'
import ShoppingList from './ShoppingList'

export const Dashboard = () => {
  return (
    <Stack direction="column" rowGap={5}>
      <DashBoardCard
        title="Přehled návštěv"
        icon={<PhotoCameraFrontOutlinedIcon fontSize="medium" color="secondary" />}>
        <VisitsList columnHeaderHeight={0} hideFooter={true} />
      </DashBoardCard>

      <DashBoardCard title="Nákupní seznam" icon={<AddShoppingCartOutlinedIcon fontSize="medium" color="secondary" />}>
        <ShoppingList columnHeaderHeight={0} hideFooter={true} />
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
