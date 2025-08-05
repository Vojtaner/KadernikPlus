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

function App() {
  const methods = useAppForm()
  console.log(import.meta.env.VITE_ENABLE_MOCKS)
  console.log(import.meta.env.VITE_IS_DEVELOPMENT)
  console.log(import.meta.env.VITE_PORT)
  console.log(import.meta.env.VITE_AUT0_DOMAIN)
  console.log(import.meta.env.VITE_API_URL)
  console.log(import.meta.env.VITE_AUT0_CLIENT_ID)
  console.log(import.meta.env.VITE_AUT0_AUDIENCE)

  return (
    <ThemeProvider theme={AppTheme}>
      <BrowserRouter>
        <AxiosProvider>
          <FormProvider {...methods}>
            <QueryClientProvider client={queryClient}>
              <Layout>
                <ReactRouterRoutes />
              </Layout>
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
