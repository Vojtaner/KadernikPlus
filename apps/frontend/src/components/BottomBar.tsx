import Stack from '@mui/material/Stack'
import MenuIconButton from './MenuIconButton'
import AddShoppingCartOutlinedIcon from '@mui/icons-material/AddShoppingCartOutlined'
import PersonAddAlt1OutlinedIcon from '@mui/icons-material/PersonAddAlt1Outlined'
import MoreTimeOutlinedIcon from '@mui/icons-material/MoreTimeOutlined'
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined'

const BottomBar = () => {
  const paddingX = '10px'
  const paddingY = '12px'

  return (
    <Stack
      display="flex"
      direction={'row'}
      zIndex={1200}
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
      <MenuIconButton icon={<PersonAddAlt1OutlinedIcon />} title="Přidat klienta" />
      <MenuIconButton icon={<MoreTimeOutlinedIcon />} title="Přidat čas" />
      <MenuIconButton color={'primary'} icon={<AddShoppingCartOutlinedIcon color="primary" />} title="Přidat položku" />
      <MenuIconButton icon={<ShoppingCartOutlinedIcon />} title="Nákupní košík" />
    </Stack>
  )
}

export default BottomBar
