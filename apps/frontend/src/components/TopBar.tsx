import { Stack, Typography } from '@mui/material'
import MenuBox from './MenuBox'
import SearchBar from './SearchBar'

function TopBar() {
  return (
    <Stack
      sx={{
        height: '10vh',
        paddingX: '10px',
        paddingY: '12px',
        position: 'sticky',
        top: 0,
        zIndex: 1100,
        background: `linear-gradient(
        270deg,
        rgba(227, 63, 92, 1) 0%,
        rgba(195, 54, 79, 1) 25%,
        rgba(154, 43, 63, 1) 86%,
        rgba(125, 35, 51, 1) 100%
      )`,
      }}>
      <Stack direction={'column'} sx={{ height: '100%', minHeight: '60px' }}>
        <Stack direction={'row'} sx={{ height: '100%' }} spacing={1}>
          <SearchBar />
          <MenuBox />
        </Stack>
        <Stack
          sx={{ height: '100%' }}
          display="flex"
          direction={'row'}
          spacing={1}
          alignItems={'center'}
          justifyContent={'space-between'}>
          {[...Array(4)].map((_, i) => (
            <Typography key={i} sx={{ flex: 1, color: 'white' }}>
              Ahoj
            </Typography>
          ))}
        </Stack>
      </Stack>
    </Stack>
  )
}

export default TopBar
