import { createTheme } from '@mui/material/styles'

const AppTheme = createTheme({
  typography: {
    fontFamily: 'Roboto, sans-serif',
    h4: {
      fontSize: '2rem',
      fontWeight: 500,
    },
    body1: {
      fontSize: '0.9rem',
      lineHeight: 1.5,
    },
    caption: {
      fontSize: '0.75rem',
      color: '#797979',
    },
    h6: {
      fontSize: '0.8rem',
      fontWeight: 600,
    },
  },
  palette: {
    success: {
      main: '#42D029',
      light: '#e5ffe0',
    },
    info: { main: '#2993D0', light: '#2993D020', dark: '#2993D0CC' },
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

export default AppTheme
