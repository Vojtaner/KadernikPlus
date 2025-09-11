import { Button } from '@mui/material'
import Stack from '@mui/material/Stack'

import type { PropsWithChildren } from 'react'
import { useScrollToTheTop } from '../../entity'

const BottomBar = (props: PropsWithChildren) => {
  const { children } = props
  const paddingX = '10px'
  const paddingY = '12px'
  const scroll = useScrollToTheTop()

  return (
    <Stack
      display="flex"
      direction="row"
      spacing={1}
      alignItems="center"
      justifyContent="space-between"
      boxShadow={'0px -4px 19px 10px rgba(0,0,0,0.15)'}
      sx={{
        borderTop: (theme) => `1px solid ${theme.palette.text.disabled}`,
        bgcolor: '#c81f5b',
        paddingX,
        paddingY,
        height: '8vh',
        position: 'sticky',
        bottom: 'env(safe-area-inset-bottom)',
      }}>
      <Button onClick={() => scroll()}>Nahoru</Button>
      {children}
    </Stack>
  )
}

export default BottomBar
