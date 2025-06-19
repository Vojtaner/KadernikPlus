import { createTheme, ThemeProvider } from '@mui/material'

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
    },
  },
})

function App() {
  return <ThemeProvider theme={theme}></ThemeProvider>
}

export default App
