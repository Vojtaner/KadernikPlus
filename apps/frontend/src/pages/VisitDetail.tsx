import { Button, Divider, Stack, Typography } from '@mui/material'
import VisitDetailGrid from './VisitDetailGrid'
import BoxIcon from '../components/BoxIcon'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import ProcedureCard from '../components/ProcedureCard'
import Note from '../components/Note'
import { generateClientDetailPath } from '../routes/AppRoutes'
import EditVisitDetailDialog from '../components/FormDialog/EditVisitDetailDialog'
import { useProceduresQuery, useVisitQuery } from '../queries'
import { useParams } from 'react-router-dom'
import AddProcedureButton from '../components/FormDialog/AddProcedureButton'
import Loader from './Loader'

const VisitDetail = () => {
  const { visitId } = useParams()
  const { data: visitData, isLoading: isLoadingVisit } = useVisitQuery(visitId)
  const { data: proceduresData, isLoading: isLoadingProcedure } = useProceduresQuery(visitId)

  if (isLoadingVisit || isLoadingProcedure) {
    return <Loader />
  }

  if (!proceduresData || !visitData) {
    return <Typography>Požadovaná data nejsou dostupná.</Typography>
  }

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
      <Note note={visitData.note} />
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
        {proceduresData.map((procedure) => (
          <ProcedureCard
            procedureId={procedure.id}
            orderNumber={procedure.stepOrder}
            description={procedure.description ?? ''}
            stockAllowances={procedure.stockAllowances}
            key={procedure.id}
          />
        ))}

        <AddProcedureButton
          openButton={
            <Button variant="outlined" sx={{ boxShadow: '0px 0px 6px 2px rgba(0,0,0,0.15)' }}>
              + Přidat proceduru
            </Button>
          }
        />
      </Stack>
    </>
  )
}

export default VisitDetail
