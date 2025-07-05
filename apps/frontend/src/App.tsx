import { ThemeProvider } from '@mui/material/styles'
import Layout from './components/Layout'
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
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './reactQuery/reactTanstackQuerySetup'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import Login from './pages/Login'

function App() {
  const methods = useAppForm()

  return (
    <ThemeProvider theme={AppTheme}>
      <BrowserRouter>
        <FormProvider {...methods}>
          <QueryClientProvider client={queryClient}>
            {location.pathname === AppRoutes.Login ? (
              <Routes>
                <Route path={AppRoutes.Login} element={<Login />} />
              </Routes>
            ) : (
              <Layout>
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
              </Layout>
            )}
            <ReactQueryDevtools initialIsOpen={false} />
          </QueryClientProvider>
        </FormProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
