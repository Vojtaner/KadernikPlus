import { ThemeProvider, createTheme } from '@mui/material/styles'
import MobileTabletLayout from './components/MobileTabletLayout'
import { Typography } from '@mui/material'

const theme = createTheme({
  palette: {
    success: {
      main: '#42D029',
    },
    info: { main: '#2993D0' },
    error: { main: '#D02929' },
    warning: { main: '#D0B729' },
    mode: 'light',
    primary: {
      main: '#D02964',
      light: '#D0296420',
      dark: '#D02964CC',
    },
    secondary: {
      main: '#E33F5C',
      light: '#E33F5C20',
      dark: '#E33F5CCC',
    },
    text: {
      primary: '#132847',
      secondary: '#797979',
      disabled: '#79797940',
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <MobileTabletLayout>
        <Typography variant="h6">Hello World</Typography>
      </MobileTabletLayout>
    </ThemeProvider>
  )
}

export default App
