import { ThemeProvider } from '@mui/material/styles'
import MobileTabletLayout from './components/MobileTabletLayout'
import AppTheme from './AppTheme'
import VisitPage from './pages/VisitPage'

function App() {
  return (
    <ThemeProvider theme={AppTheme}>
      <MobileTabletLayout>
        <VisitPage />
      </MobileTabletLayout>
    </ThemeProvider>
  )
}

export default App
