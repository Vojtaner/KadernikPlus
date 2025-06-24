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
import Consumption from './pages/Consumption'
import PriceList from './pages/PriceList'
import Logs from './pages/Logs'
import MyProfile from './pages/MyProfile'
import { useAppForm } from './reactHookForm/store'
import { FormProvider } from 'react-hook-form'
import { Dashboard } from './pages/Dashboard'
import VisitDetail from './pages/VisitDetail'

function App() {
  const methods = useAppForm()

  return (
    <ThemeProvider theme={AppTheme}>
      <BrowserRouter>
        <FormProvider {...methods}>
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
              <Route path={AppRoutes.VisitDetail} element={<VisitDetail />} />
              <Route path={AppRoutes.CustomerProfile} element={<CustomerProfile />} />
              <Route path={AppRoutes.Warehouse} element={<WareHouse />} />
            </Routes>
          </MobileTabletLayout>
        </FormProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
