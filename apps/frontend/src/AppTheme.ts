import { createTheme } from '@mui/material/styles'
import { type LinkProps } from '@mui/material/Link'
import { LinkBehavior } from './app/components/LinkBehaviour'
import { csCZ } from '@mui/x-date-pickers/locales'

const AppTheme = createTheme(
  {
    components: {
      MuiLink: {
        defaultProps: {
          component: LinkBehavior,
        } as LinkProps,
      },
      MuiButton: {
        styleOverrides: {
          root: {
            boxShadow: '0px 2px 6px rgba(0,0,0,0.2)',
            borderRadius: '10px',
            color: '#D02964',
            textTransform: 'none',
            '&:hover': {
              backgroundColor: '#D02964',
              color: 'white',
            },
          },
          contained: {
            backgroundColor: `linear-gradient(
        270deg,
        rgba(227, 63, 92, 1) 0%,
        rgba(195, 54, 79, 1) 25%,
        rgba(154, 43, 63, 1) 86%,
        rgba(125, 35, 51, 1) 100%
      )`,
            color: '#fff',
            '&:hover': {
              backgroundColor: '#D02964',
              color: '#ffffff',
            },
          },
        },
      },
    },
    typography: {
      fontFamily: 'Roboto, sans-serif',
      h4: {
        fontSize: '2rem',
        fontWeight: 500,
      },
      body1: {
        fontSize: '1rem',
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
      grey: {
        200: '#B0BEC520',
        500: '#B0BEC5CC',
      },
    },
  },
  csCZ
)

export default AppTheme
