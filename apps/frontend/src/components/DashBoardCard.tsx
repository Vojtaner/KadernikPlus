import { IconButton, Stack, Typography, type SxProps } from '@mui/material'
import Paper from './Paper'
import type { ReactNode } from 'react'

type DashBoardCardProps = { children: ReactNode; title: string; icon: ReactNode; action?: ReactNode; sx?: SxProps }

const DashBoardCard = (props: DashBoardCardProps) => {
  const { children, title, icon, action, sx } = props
  return (
    <Paper sx={{ ...sx }}>
      <Stack direction="column" rowGap="10px">
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton href="/">{icon}</IconButton>
          <Typography
            sx={{
              fontSize: '15px',
              fontWeight: 600,
            }}>
            {title}
          </Typography>
          {action}
        </Stack>
        {children}
      </Stack>
    </Paper>
  )
}

export default DashBoardCard
