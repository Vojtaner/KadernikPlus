import Stack from '@mui/material/Stack'
import BottomBar from './BottomBar'
import SectionHeader from './SectionHeader'
import TopBar from './TopBar'
import type { PropsWithChildren } from 'react'
import { Box } from '@mui/material'
import { SideMenu } from './SideMenu'

export const MobileTabletLayout = (props: PropsWithChildren) => {
  const { children } = props

  return (
    <Stack>
      <Stack
        sx={{
          position: 'sticky',
          top: 0,
          width: '100%',
        }}>
        <TopBar />
        <SectionHeader />
      </Stack>
      <Box
        paddingX="10px"
        paddingY="12px"
        bgcolor="white"
        marginTop="-1px"
        sx={{ bgcolor: 'white', height: '100%', minHeight: '100vh' }}>
        {children}
      </Box>
      <BottomBar />
      <SideMenu />
    </Stack>
  )
}
