import { Button, Divider, Stack, Typography } from '@mui/material'
import VisitDetailGrid, { hasAnyStockAllowance } from './VisitDetailGrid'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import ProcedureCard from '../components/ProcedureCard'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Note from '../components/Note'
import EditVisitDetailDialog from '../components/FormDialogs/EditVisitDetailDialog'
import { useClientVisitsQuery, useDeleteVisitMutation, useProceduresQuery, useVisitQuery } from '../queries'
import { useParams } from 'react-router-dom'
import AddProcedureButton from '../components/FormDialogs/AddProcedureButton'
import Loader from './Loader'
import { useAppDispatch } from '../store'
import { setCurrentLocationAppendix } from '../store/appUiSlice'
import AppTheme from '../AppTheme'
import { Paths } from '../routes/AppRoutes'
import { useAppNavigate } from '../hooks'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DeleteVisitDialogProps from '../components/FormDialogs/DeleteVisitDialog'

const VisitDetail = () => {
  const { visitId, clientId } = useParams()

  const { data: visitData, isLoading: isLoadingVisit, isSuccess: isSuccessVisitData } = useVisitQuery(visitId)
  const { data: clientVisits } = useClientVisitsQuery(clientId)
  const { data: proceduresData, isLoading: isLoadingProcedure } = useProceduresQuery(visitId)
  const dispatch = useAppDispatch()
  const navigate = useAppNavigate()
  const { mutate: deleteVisitMutation } = useDeleteVisitMutation()

  const lastVisitWithProcedure =
    clientVisits && clientVisits.filter((visit) => visit.procedures.length && visitData?.id !== visit.id)

  const previusVisitProcedure = lastVisitWithProcedure && lastVisitWithProcedure[0]

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

  const isVisitDeletable = !hasAnyStockAllowance(proceduresData)

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
              Dokončit
            </Button>
          }
        />
        {visitData && (
          <Button
            size="medium"
            startIcon={<ManageAccountsOutlinedIcon fontSize="small" color="primary" />}
            sx={{ background: `${AppTheme.palette.primary.light}` }}
            onClick={() => navigate(Paths.clientDetail(visitData.clientId))}>
            Profil zákazníka
          </Button>
        )}
        {visitData && (
          <DeleteVisitDialogProps
            openButton={
              <Button
                disabled={!isVisitDeletable}
                size="medium"
                startIcon={<DeleteOutlineIcon fontSize="small" color={!isVisitDeletable ? 'disabled' : 'primary'} />}
                sx={{ background: `${AppTheme.palette.primary.light}` }}
                onClick={() => {
                  deleteVisitMutation(visitId)
                  navigate(Paths.clientDetail(visitData.clientId))
                }}>
                Smazat
              </Button>
            }
            onConfirm={() => deleteVisitMutation(visitId)}
          />
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
        {previusVisitProcedure &&
          hasZeroProcedures &&
          previusVisitProcedure.procedures.map((procedure) => (
            <ProcedureCard
              isDisabled={true}
              procedureId={procedure.id}
              orderNumber={procedure.stepOrder}
              description={procedure.description ?? ''}
              stockAllowances={procedure.stockAllowances}
              key={procedure.id}
            />
          ))}
      </Stack>
    </>
  )
}

export default VisitDetail
