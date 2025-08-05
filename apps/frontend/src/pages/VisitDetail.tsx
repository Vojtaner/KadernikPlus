import { Button, Divider, Stack, Typography } from '@mui/material'
import VisitDetailGrid from './VisitDetailGrid'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import ProcedureCard from '../components/ProcedureCard'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Note from '../components/Note'
import { generateClientDetailPath } from '../routes/AppRoutes'
import EditVisitDetailDialog from '../components/FormDialog/EditVisitDetailDialog'
import { useProceduresQuery, useVisitQuery } from '../queries'
import { useParams } from 'react-router-dom'
import AddProcedureButton from '../components/FormDialog/AddProcedureButton'
import Loader from './Loader'
import { useAppDispatch } from '../store'
import { setCurrentLocationAppendix } from '../store/appUiSlice'
import AppTheme from '../AppTheme'

const VisitDetail = () => {
  const { visitId } = useParams()
  const { data: visitData, isLoading: isLoadingVisit, isSuccess: isSuccessVisitData } = useVisitQuery(visitId)
  const { data: proceduresData, isLoading: isLoadingProcedure } = useProceduresQuery(visitId)
  const dispatch = useAppDispatch()

  if (isLoadingVisit || isLoadingProcedure) {
    return <Loader />
  }

  if (isSuccessVisitData) {
    const name = `${visitData.client.firstName} ${visitData.client.lastName}`.toUpperCase()
    const serviceName = visitData.visitServices[0].service.serviceName
    dispatch(setCurrentLocationAppendix(`${name} - ${serviceName}`))
  }

  if (!proceduresData || !visitData) {
    return <Typography>Požadovaná data nejsou dostupná.</Typography>
  }

  const hasZeroProcedures = proceduresData.length === 0

  return (
    <>
      <VisitDetailGrid visitData={visitData} />
      <Stack spacing={2} direction="row" alignItems="center" justifyContent="flex-start" paddingY={2}>
        <EditVisitDetailDialog
          openButton={
            <Button
              size="medium"
              sx={{ background: `${AppTheme.palette.primary.light}` }}
              startIcon={<EditOutlinedIcon fontSize="small" color="secondary" />}>
              Upravit návštěvu
            </Button>
          }
        />
        {visitData && (
          <Button
            size="medium"
            startIcon={<ManageAccountsOutlinedIcon fontSize="small" color="primary" />}
            sx={{ background: `${AppTheme.palette.primary.light}` }}
            href={generateClientDetailPath(visitData.clientId)}>
            Profil zákazníka
          </Button>
        )}
      </Stack>
      <Divider />
      <Note note={visitData.note} label="Informace k návštěvě" />
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

        {hasZeroProcedures && (
          <AddProcedureButton
            openButton={
              <Button variant="outlined" sx={{ boxShadow: '0px 0px 6px 2px rgba(0,0,0,0.15)' }}>
                + Přidat proceduru
              </Button>
            }
          />
        )}
      </Stack>
    </>
  )
}

export default VisitDetail
