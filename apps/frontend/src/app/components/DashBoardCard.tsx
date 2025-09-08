import { IconButton, Stack, Typography, type SxProps } from '@mui/material'
import Paper from './Paper'
import type { ReactNode } from 'react'

type DashBoardCardProps = { children: ReactNode; title: string; icon: ReactNode; action?: ReactNode; sx?: SxProps }

const DashBoardCard = (props: DashBoardCardProps) => {
  const { children, title, icon, action, sx } = props
  return (
    <Paper sx={{ ...sx, boxShadow: '0px 4px 6px rgba(0,0,0,1)' }}>
      <Stack direction="column" rowGap="10px">
        <Stack direction="row" alignItems="center" spacing={2}>
          <IconButton>{icon}</IconButton>
          <Typography
            color="secondary"
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
