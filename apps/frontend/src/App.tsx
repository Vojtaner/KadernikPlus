import { ThemeProvider } from '@mui/material/styles'
import { MobileTabletLayout } from './components/MobileTabletLayout'
import AppTheme from './AppTheme'
import CustomerVisitsList from './pages/CustomerVisitsList'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AppRoutes } from './routes/AppRoutes'
import { OverviewPage } from './pages/OverviewPage'
import VisitsList from './pages/VisitsList'

function App() {
  return (
    <ThemeProvider theme={AppTheme}>
      <BrowserRouter>
        <MobileTabletLayout>
          <Routes>
            <Route path={AppRoutes.CustomerVisitsList} element={<CustomerVisitsList />} />
            <Route path={AppRoutes.HomeOverview} element={<OverviewPage />} />
            <Route path={AppRoutes.VisitsList} element={<VisitsList />} />
          </Routes>
        </MobileTabletLayout>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
