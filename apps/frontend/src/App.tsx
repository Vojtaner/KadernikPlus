import { ThemeProvider } from '@mui/material/styles'
import Layout from './components/Layout'
import AppTheme from './AppTheme'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useAppForm } from './reactHookForm/store'
import { FormProvider } from 'react-hook-form'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './reactQuery/reactTanstackQuerySetup'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AxiosProvider } from './axios/axios'
import ReactRouterRoutes from './routes/ReactRouterRoutes'
import { SnackbarMessages } from './components/SnackBarMessages'
import AuthGuard from './components/AuthGuard'
import { ROUTES } from './routes/AppRoutes'
import { SubscriptionPage } from './pages/SubscriptionPage'
import SubscriptionGuard from './components/SubscriptionGuard'

function App() {
  const methods = useAppForm()

  return (
    <ThemeProvider theme={AppTheme}>
      <BrowserRouter>
        <AxiosProvider>
          <FormProvider {...methods}>
            <QueryClientProvider client={queryClient}>
              <AuthGuard>
                <Routes>
                  <Route path={ROUTES.subscription.path} element={<SubscriptionPage />} />

                  <Route
                    path="/*"
                    element={
                      <SubscriptionGuard>
                        <Layout>
                          <ReactRouterRoutes />
                        </Layout>
                      </SubscriptionGuard>
                    }
                  />
                </Routes>
              </AuthGuard>

              <SnackbarMessages />
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </FormProvider>
        </AxiosProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
