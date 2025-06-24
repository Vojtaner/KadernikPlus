import { ThemeProvider } from '@mui/material/styles'
import { MobileTabletLayout } from './components/MobileTabletLayout'
import AppTheme from './AppTheme'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes'
import VisitsList from './pages/VisitsList'
import CustomerProfile from './pages/CustomerProfile'
import SmsPage from './pages/SmsPage'
import WareHouse from './pages/WareHouse'
import ShoppingList from './pages/ShoppingList'
import { Dashboard } from '@mui/icons-material'
import Consumption from './pages/Consumption'
import PriceList from './pages/PriceList'
import Logs from './pages/Logs'
import MyProfile from './pages/MyProfile'
import VisitDetail from './pages/VisitDetail'

function App() {
  return (
    <ThemeProvider theme={AppTheme}>
      <BrowserRouter basename="/KadernikPlus/#/">
        <MobileTabletLayout>
          <Routes>
            <Route path={AppRoutes.MyProfile} element={<MyProfile />} />
            <Route path={AppRoutes.Dashboard} element={<Dashboard />} />
            <Route path={AppRoutes.Sms} element={<SmsPage />} />
            <Route path={AppRoutes.ShoppingList} element={<ShoppingList />} />
            <Route path={AppRoutes.Consumption} element={<Consumption />} />
            <Route path={AppRoutes.PriceList} element={<PriceList />} />
            <Route path={AppRoutes.Logs} element={<Logs />} />
            <Route path={AppRoutes.VisitsList} element={<VisitsList />} />
            <Route path={AppRoutes.CustomerProfile} element={<CustomerProfile />} />
            <Route path={AppRoutes.Warehouse} element={<WareHouse />} />
            <Route path={AppRoutes.VisitDetail} element={<VisitDetail />} />
          </Routes>
        </MobileTabletLayout>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
