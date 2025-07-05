import { Button, Stack, Typography } from '@mui/material'
import Textfield from '../components/TextField'

const Login = () => {
  return (
    <Stack
      sx={{
        mt: '5rem',
        width: { md: '300px', xs: '90vw' },
        mx: 'auto',
      }}
      rowGap={3}>
      <img src="../../public/assets/logofornow.png" width="100px" style={{ margin: 'auto' }} />
      <Stack rowGap={2}>
        <Typography variant="h5" fontWeight={600}>
          Přihlášení
        </Typography>
        <Textfield fieldPath="loginName" placeholder="Přihlašovací jméno"></Textfield>
        <Textfield fieldPath="loginPassword" placeholder="Heslo"></Textfield>
        <Button variant="contained">Přihlásit se</Button>
      </Stack>
    </Stack>
  )
}

export default Login
