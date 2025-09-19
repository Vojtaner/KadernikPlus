import { Button, Divider, Stack, Tooltip, Typography } from '@mui/material'
import ManageAccountsOutlinedIcon from '@mui/icons-material/ManageAccountsOutlined'
import EditOutlinedIcon from '@mui/icons-material/EditOutlined'
import Note from '../../app/components/Note'
import EditVisitDetailDialog from '../visits/components/EditVisitDetailDialog'
import { useParams } from 'react-router-dom'
import Loader from './Loader'
import { useAppDispatch } from '../../store/store'
import { setCurrentLocationAppendix } from '../../store/appUiSlice'
import AppTheme from '../../AppTheme'
import { Paths } from '../../routes/AppRoutes'
import { useAppNavigate } from '../../hooks'
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline'
import DeleteVisitDialogProps from '../visits/components/DeleteVisitDialog'
import AddProcedureButton from '../procedure/components/AddProcedureButton'
import VisitDetailGrid, { hasAnyStockAllowance } from '../visits/components/VisitDetailGrid'
import { useProceduresQuery } from '../procedure/queries'
import { useVisitQuery, useClientVisitsQuery, useDeleteVisitMutation } from '../visits/queries'
import ProcedureCard from '../ProcedureCard'
import { queryClient } from '../../reactQuery/reactTanstackQuerySetup'
import { useEffect } from 'react'

const VisitDetail = () => {
  const { visitId, clientId } = useParams()
  const { data: visitData, isLoading: isLoadingVisit } = useVisitQuery(visitId)
  const { data: clientVisits } = useClientVisitsQuery(clientId)
  const { data: proceduresData, isLoading: isLoadingProcedure } = useProceduresQuery(visitId)

  const dispatch = useAppDispatch()
  const navigate = useAppNavigate()
  const { mutate: deleteVisitMutation } = useDeleteVisitMutation()

  const lastVisitWithProcedure =
    clientVisits && clientVisits.filter((visit) => visit.procedures.length && visitData?.id !== visit.id)

  const previusVisitProcedure = lastVisitWithProcedure && lastVisitWithProcedure[0]

  useEffect(() => {
    if (visitData) {
      const name = `${visitData.client.firstName} ${visitData.client.lastName}`.toUpperCase()
      const serviceName = visitData.visitServices[0].service.serviceName
      dispatch(setCurrentLocationAppendix(`${name} - ${serviceName}`))
    }
  }, [visitData, dispatch])

  if (isLoadingVisit || isLoadingProcedure) {
    return <Loader />
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
              startIcon={<EditOutlinedIcon fontSize="small" color="primary" />}>
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
              <Tooltip title="Nelze smazat návštěva, pokud máte vytvořenou spotřebu.">
                <Button
                  disabled={!isVisitDeletable}
                  size="medium"
                  startIcon={<DeleteOutlineIcon fontSize="small" color={!isVisitDeletable ? 'disabled' : 'primary'} />}
                  sx={{ background: `${AppTheme.palette.primary.light}` }}
                  onClick={() => {
                    deleteVisitMutation(visitId)
                    navigate(Paths.clientDetail(visitData.clientId))
                    queryClient.invalidateQueries({ queryKey: ['visits'] })
                  }}>
                  Smazat
                </Button>
              </Tooltip>
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

      <Stack spacing={4}>
        {proceduresData.map((procedure) => (
          <ProcedureCard
            disabled={visitData.visitStatus}
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
              <Button
                variant="outlined"
                disabled={visitData.visitStatus}
                sx={{ boxShadow: '0px 0px 6px 2px rgba(0,0,0,0.15)' }}>
                + Přidat proceduru
              </Button>
            }
          />
        )}
        {visitData.visitStatus && (
          <Typography color="info" fontWeight="600" align="center">
            Návštěva je uzavřená z bezpečnostních důvodů ji nelze editovat ani smazat. Můžete ji znovu otevřít v
            dokončení návštěvy.
          </Typography>
        )}
        {previusVisitProcedure &&
          hasZeroProcedures &&
          previusVisitProcedure.procedures.map((procedure) => (
            <ProcedureCard
              isPreviousCopy={true}
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
