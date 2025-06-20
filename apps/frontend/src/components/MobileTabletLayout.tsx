import Stack from '@mui/material/Stack'
import BottomBar from './BottomBar'
import SectionHeader from './SectionHeader'
import TopBar from './TopBar'
import type { PropsWithChildren } from 'react'
import { Box } from '@mui/material'

const MobileTabletLayout = (props: PropsWithChildren) => {
  const { children } = props
  const paddingX = '10px'
  const paddingY = '12px'

  return (
    <Stack sx={{ minHeight: '100vh' }}>
      <Stack
        sx={{
          position: 'sticky',
          top: 0,
          zIndex: 1200,
          width: '100%',
        }}>
        <TopBar />
        <SectionHeader />
      </Stack>
      <Box paddingX={paddingX} paddingY={paddingY} bgcolor={'white'} marginTop={'-1px'} flex={1}>
        {children}
      </Box>
      <BottomBar />
    </Stack>
  )
}

export default MobileTabletLayout
