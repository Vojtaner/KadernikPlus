import Stack from '@mui/material/Stack'
import MenuIconButton from './MenuIconButton'

const BottomBar = () => {
  const paddingX = '10px'
  const paddingY = '12px'

  return (
    <Stack
      display="flex"
      direction={'row'}
      spacing={1}
      alignItems={'center'}
      justifyContent={'space-between'}
      sx={{
        borderTop: (theme) => `1px solid ${theme.palette.text.disabled}`,
        bgcolor: 'white',
        paddingX,
        paddingY,
        height: '8vh',
        position: 'sticky',
        bottom: 'env(safe-area-inset-bottom)',
      }}>
      {[...Array(4)].map((_, i) => (
        <MenuIconButton key={i} />
      ))}
    </Stack>
  )
}

export default BottomBar
