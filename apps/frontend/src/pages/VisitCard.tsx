import { Stack, Divider, Grid, Switch, Typography } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import DetailColumn from '../components/DetailColumn'
import BoxIcon from '../components/BoxIcon'
import Note from '../components/Note'
import ProcedureCard from '../components/ProcedureCard'

const VisitCard = () => {
  return (
    <>
      <Grid container rowSpacing={2}>
        <Grid size={4}>
          <DetailColumn label={'Kadeřnice'} input={'Monika L.'} />
        </Grid>
        <Grid size={4}>
          <DetailColumn label={'Cena'} input={'1250,00 Kč'} />
        </Grid>
        <Grid size={4}>
          <DetailColumn label={'Datum'} input={'12.3.2025'} />
        </Grid>
        <Grid size={4}>
          <DetailColumn
            label={'Stav zálohy'}
            input={
              <Typography textTransform={'uppercase'} color="info.main" fontWeight={600}>
                Bez zálohy
              </Typography>
            }
          />
        </Grid>
        <Grid size={4}>
          <DetailColumn label={'Výše zálohy'} input={'250,00 Kč'} />
        </Grid>
        <Grid size={4} padding={0}>
          <DetailColumn label={'Uzavřeno'} input={<Switch defaultChecked />} />
        </Grid>
      </Grid>
      <Stack spacing={2} direction={'row'} alignItems="center" justifyContent={'flex-start'} paddingY={2}>
        <BoxIcon
          size={30}
          icon={<ManageAccountsOutlinedIcon fontSize="small" color="primary" />}
          boxColor="primary.light"
        />
        <BoxIcon size={30} icon={<EditOutlinedIcon fontSize="small" color="secondary" />} boxColor="secondary.light" />
      </Stack>
      <Divider />
      <Note />
      <Divider
        sx={{
          '& .MuiDivider-wrapper': {
            fontSize: '0.80rem',
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 600,
            lineHeight: 1.5,
            color: 'primary.main',
            paddingY: 1,
          },
        }}>
        Postup
      </Divider>
      <ProcedureCard />
      <ProcedureCard />
      <ProcedureCard />
      <ProcedureCard />
      <ProcedureCard />
      <ProcedureCard />
    </>
  )
}

export default VisitCard
