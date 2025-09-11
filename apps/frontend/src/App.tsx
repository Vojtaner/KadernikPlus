import { ThemeProvider } from '@mui/material/styles'
import AppTheme from './AppTheme'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { useAppForm } from './reactHookForm/store'
import { FormProvider } from 'react-hook-form'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './reactQuery/reactTanstackQuerySetup'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AxiosProvider } from './axios/axios'
import ReactRouterRoutes from './routes/ReactRouterRoutes'
import { SnackbarMessages } from './app/components/SnackBarMessages'
import AuthGuard from './app/components/AuthGuard'
import { ROUTES } from './routes/AppRoutes'
import { SubscriptionPage } from './hairdresser/pages/SubscriptionPage'
import { useDispatch, useSelector } from 'react-redux'
import { selectSnackbarMessages } from './hooks/useAddSnackBar'
import type { RootState } from './store/store'
import { removedSnackbarMessage } from './store/snackBarReducer'
import SubscriptionGuard from './hairdresser/SubscriptionGuard'
import Layout from './hairdresser/Layout'

function App() {
  const methods = useAppForm()
  const dispatch = useDispatch()
  const snackbarMessages = useSelector((state: RootState) => selectSnackbarMessages(state))

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

              <SnackbarMessages
                snackbarMessages={snackbarMessages}
                onRemoveSnackMessage={(uniqueMessage) =>
                  dispatch(removedSnackbarMessage({ messageUnique: uniqueMessage }))
                }
              />
              <ReactQueryDevtools initialIsOpen={false} />
            </QueryClientProvider>
          </FormProvider>
        </AxiosProvider>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
