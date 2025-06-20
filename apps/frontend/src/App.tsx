import { ThemeProvider } from '@mui/material/styles'
import MobileTabletLayout from './components/MobileTabletLayout'
import AppTheme from './AppTheme'
import VisitCard from './pages/VisitCard'
import ClientPage from './pages/ClientPage'
import { useState } from 'react'
import Button from '@mui/material/Button'

const App = () => {
  const [change, setChange] = useState(false)

  return (
    <ThemeProvider theme={AppTheme}>
      <Button onClick={() => setChange((prev) => !prev)}>t</Button>
      <MobileTabletLayout>{change ? <ClientPage /> : <VisitCard />}</MobileTabletLayout>
    </ThemeProvider>
  )
}

export default App
