import { Stack, Divider } from '@mui/material'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import BoxIcon from './BoxIcon'
import Note from './Note'
import ProcedureCard from './ProcedureCard'
import VisitDetailGrid from '../pages/VisitDetailGrid'

const VisitPage = () => {
  return (
    <>
      <VisitDetailGrid />
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
    </>
  )
}

export default VisitPage
