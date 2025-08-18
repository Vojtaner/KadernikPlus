import { ThemeProvider } from '@mui/material/styles'
import Layout from './components/Layout'
import AppTheme from './AppTheme'
import { BrowserRouter } from 'react-router-dom'
import { useAppForm } from './reactHookForm/store'
import { FormProvider } from 'react-hook-form'
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './reactQuery/reactTanstackQuerySetup'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { AxiosProvider } from './axios/axios'
import ReactRouterRoutes from './routes/ReactRouterRoutes'
import { SnackbarMessages } from './components/SnackBarMessages'
import AuthGuard from './components/AuthGuard'

function App() {
  const methods = useAppForm()

  return (
    <ThemeProvider theme={AppTheme}>
      <BrowserRouter>
        <AxiosProvider>
          <FormProvider {...methods}>
            <QueryClientProvider client={queryClient}>
              <AuthGuard>
                <Layout>
                  <ReactRouterRoutes />
                </Layout>
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
