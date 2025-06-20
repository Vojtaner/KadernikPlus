import { ThemeProvider } from '@mui/material/styles'
import MobileTabletLayout from './components/MobileTabletLayout'
import AppTheme from './AppTheme'
import VisitCard from './pages/VisitCard'
import ClientPage from './pages/ClientPage'

const App = () => {
  return (
    <ThemeProvider theme={AppTheme}>
      <MobileTabletLayout></MobileTabletLayout>
    </ThemeProvider>
  )
}

export default App
