import { alpha, styled, Switch } from '@mui/material'

const RedSwitch = styled(Switch)(({ theme }) => ({
  '& .MuiSwitch-switchBase': {
    color: theme.palette.secondary.main,
    '&:hover': {
      backgroundColor: alpha(theme.palette.secondary.main, theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked': {
    color: theme.palette.success.main,
    '&:hover': {
      backgroundColor: alpha(theme.palette.success.main, theme.palette.action.hoverOpacity),
    },
  },
  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
    backgroundColor: theme.palette.success.main,
  },
  '& .MuiSwitch-track': {
    backgroundColor: theme.palette.secondary.main,
  },
}))

export default RedSwitch
