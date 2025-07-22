import { Divider, Stack } from '@mui/material'
import VisitDetailGrid from './VisitDetailGrid'
import BoxIcon from '../components/BoxIcon'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import ProcedureCard from '../components/ProcedureCard'
import Note from '../components/Note'
import { generateClientDetailPath } from '../routes/AppRoutes'
import EditVisitDetailDialog from '../components/EditVisitDetailDialog'
import { useVisitQuery } from '../queries'
import { useParams } from 'react-router-dom'

const VisitDetail = () => {
  const { visitId } = useParams()
  const { data: visitData } = useVisitQuery(visitId)

  return (
    <>
      <VisitDetailGrid visitData={visitData} />
      <Stack spacing={2} direction="row" alignItems="center" justifyContent="flex-start" paddingY={2}>
        <EditVisitDetailDialog />
        {visitData && (
          <BoxIcon
            size="medium"
            icon={<ManageAccountsOutlinedIcon fontSize="small" color="primary" />}
            boxColor="primary.light"
            href={generateClientDetailPath(visitData.clientId)}
          />
        )}
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
      <Stack spacing={2}>
        <ProcedureCard />
        <ProcedureCard />
        <ProcedureCard />
      </Stack>
    </>
  )
}

export default VisitDetail
