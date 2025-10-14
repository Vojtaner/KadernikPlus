import type { Theme } from '@emotion/react'
import { type SxProps, Stack, Box, Typography } from '@mui/material'
import AppTheme from '../AppTheme'

type TopBarFilterButtonsStackProps = {
  sx: SxProps<Theme>
}

export const TopBarFilterButtonsStack = (props: TopBarFilterButtonsStackProps) => {
  const { sx } = props

  return (
    <Stack sx={{ ...sx }} display="flex" direction="row" spacing={4}>
      <TopBarFilterButton isActive={true} text="Všichni" />
      <TopBarFilterButton isActive={false} text="Pavla" />
      <TopBarFilterButton isActive={false} text="Monika" />
    </Stack>
  )
}

type TopBarFilterButtonProps = {
  isActive: boolean
  onClick?: () => void
  text: string
}

const TopBarFilterButton = (props: TopBarFilterButtonProps) => {
  const { isActive = false, onClick, text } = props

  const buttonProps = {
    bgcolor: isActive ? AppTheme.palette.common.white : '',
    borderRadius: '5px',
    padding: '5px',
    color: isActive ? AppTheme.palette.primary.main : AppTheme.palette.common.white,
  }

  return (
    <Box {...buttonProps} onClick={onClick}>
      <Typography sx={{ minWidth: 'max-content', width: 'auto' }} fontSize="small">
        {text}
      </Typography>
    </Box>
  )
}
