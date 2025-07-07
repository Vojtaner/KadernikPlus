import { IconButton, Stack, Typography } from '@mui/material'
import Paper from './Paper'
import type { ReactNode } from 'react'

type DashBoardCardProps = { children: ReactNode; title: string; icon: ReactNode; action?: ReactNode }

const DashBoardCard = (props: DashBoardCardProps) => {
  const { children, title, icon, action } = props
  return (
    <Paper>
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
