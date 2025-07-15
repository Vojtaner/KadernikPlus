import { ThemeProvider } from '@mui/material/styles'
import Layout from './components/Layout'
import AppTheme from './AppTheme'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes'
import VisitsList from './pages/VisitsList'
import CustomerProfile from './pages/CustomerProfile'
import SmsPage from './pages/SmsPage'
import Stock from './pages/Stock'
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
import { AuthenticationGuard } from './components/AuthenticationGuard'
import { AxiosProvider } from './axios/axios'

function App() {
  const methods = useAppForm()

  return (
    <ThemeProvider theme={AppTheme}>
      <BrowserRouter>
        <AxiosProvider>
          <FormProvider {...methods}>
            <QueryClientProvider client={queryClient}>
              <Layout>
                <Routes>
                  <Route path={AppRoutes.MyProfile} element={<AuthenticationGuard component={MyProfile} />} />
                  <Route path={AppRoutes.Dashboard} element={<AuthenticationGuard component={Dashboard} />} />
                  <Route path={AppRoutes.Sms} element={<AuthenticationGuard component={SmsPage} />} />
                  <Route path={AppRoutes.ShoppingList} element={<AuthenticationGuard component={ShoppingList} />} />
                  <Route path={AppRoutes.Consumption} element={<AuthenticationGuard component={Consumption} />} />
                  <Route path={AppRoutes.PriceList} element={<AuthenticationGuard component={PriceList} />} />
                  <Route path={AppRoutes.Logs} element={<AuthenticationGuard component={Logs} />} />
                  <Route path={AppRoutes.VisitsList} element={<AuthenticationGuard component={VisitsList} />} />
                  <Route path={AppRoutes.VisitDetail} element={<AuthenticationGuard component={VisitDetail} />} />
                  <Route
                    path={AppRoutes.CustomerProfile}
                    element={<AuthenticationGuard component={CustomerProfile} />}
                  />
                  <Route path={AppRoutes.stock} element={<AuthenticationGuard component={Stock} />} />
                </Routes>
              </Layout>
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </FormProvider>
        </AxiosProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
