import { Stack, Typography } from '@mui/material'
import BoxIcon from './BoxIcon'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'

const Note = () => {
  return (
    <Stack direction="column" spacing={1} paddingY={1}>
      <Stack direction={'row'} spacing={1} alignItems="flex-end">
        <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1, padding: 0, margin: 0 }}>
          Poznámka
        </Typography>
        <BoxIcon icon={<EditOutlinedIcon fontSize="inherit" color="primary" />} />
      </Stack>
      <Typography variant="body2" textAlign={'left'} color="text.primary">
        Barva chytla rovnoměrně, vlasy byly mírně suché, doporučeno hloubkové ošetření. Nechala si zkrátit konečky,
        spokojená s výsledkem, příště znovu studený odstín.
      </Typography>
    </Stack>
  )
}
export default Note
