import Stack from '@mui/material/Stack'
import BottomBar from './BottomBar'
import SectionHeader from './SectionHeader'
import TopBar from './TopBar'
import type { PropsWithChildren } from 'react'

const MobileTabletLayout = (props: PropsWithChildren) => {
  const { children } = props
  const paddingX = '10px'
  const paddingY = '12px'

  return (
    <Stack sx={{ minHeight: '100vh' }}>
      <TopBar />
      <Stack
        sx={{
          bgcolor: 'white',
          paddingX,
          paddingY,
          borderRadius: '15px 15px 0 0',
          flex: 1,
        }}>
        <SectionHeader />
        {children}
      </Stack>
      <BottomBar />
    </Stack>
  )
}

export default MobileTabletLayout
