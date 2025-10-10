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
            // default hover for non-contained buttons
            '&:hover': {
              backgroundColor: '#D02964',
              color: '#ffffff',
              // change icon color for start/end icons on hover
              '& .MuiButton-startIcon, & .MuiButton-endIcon': {
                // the icon itself can be an <svg> or .MuiSvgIcon-root
                '& .MuiSvgIcon-root, & svg': {
                  color: '#ffffff',
                },
              },
            },
            // ensure icon default color (when not hovered)
            '& .MuiButton-startIcon, & .MuiButton-endIcon': {
              '& .MuiSvgIcon-root, & svg': {
                color: 'inherit',
              },
            },
          },

          contained: {
            color: '#fff',
            boxShadow: '0px 2px 6px rgba(0,0,0,0.2)',
            '&:hover': {
              // on hover we switch to a solid color — or you can tweak to a modified gradient
              background: '#D02964',
              color: '#ffffff',
              '& .MuiButton-startIcon, & .MuiButton-endIcon': {
                '& .MuiSvgIcon-root, & svg': {
                  color: '#ffffff',
                },
              },
            },
            // ensure icon inherits white color by default in contained
            '& .MuiButton-startIcon, & .MuiButton-endIcon': {
              '& .MuiSvgIcon-root, & svg': {
                color: '#ffffff',
              },
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
