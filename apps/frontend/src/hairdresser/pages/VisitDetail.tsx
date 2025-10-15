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
import DeleteDialog from '../visits/components/DeleteDialog'
import AddProcedureButton from '../procedure/components/AddProcedureButton'
import VisitDetailGrid, { hasAnyStockAllowance } from '../visits/components/VisitDetailGrid'
import { useProceduresQuery } from '../procedure/queries'
import { useVisitQuery, useClientVisitsQuery, useDeleteVisitMutation } from '../visits/queries'
import ProcedureCard from '../ProcedureCard'
import { useEffect } from 'react'
import { FormattedMessage } from 'react-intl'

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
    return (
      <Typography>
        <FormattedMessage defaultMessage="Požadovaná data nejsou dostupná." id="visitDetail.failedToLoadData" />
      </Typography>
    )
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
              <FormattedMessage defaultMessage="Dokončit" id="visitDetail.finalize" />
            </Button>
          }
        />
        {visitData && (
          <Button
            size="medium"
            startIcon={<ManageAccountsOutlinedIcon fontSize="small" color="primary" />}
            sx={{ background: `${AppTheme.palette.primary.light}` }}
            onClick={() => navigate(Paths.clientDetail(visitData.clientId))}>
            <FormattedMessage defaultMessage="Profil zákazníka" id="visitDetail.customerProfile" />
          </Button>
        )}
        {visitData && (
          <DeleteDialog
            openButton={
              <Tooltip title="Nelze smazat návštěva, pokud máte vytvořenou spotřebu.">
                <Button
                  disabled={!isVisitDeletable}
                  size="medium"
                  startIcon={<DeleteOutlineIcon fontSize="small" color={!isVisitDeletable ? 'disabled' : 'primary'} />}
                  sx={{ background: `${AppTheme.palette.primary.light}` }}>
                  <FormattedMessage defaultMessage="Smazat" id="visitDetail.delete" />
                </Button>
              </Tooltip>
            }
            title="Opravu si přejete smazat návštěvu?"
            dialogHelperText="Návštěva bude smazána z vašeho seznamu."
            onConfirm={() => {
              deleteVisitMutation(visitId)
              navigate(Paths.clientDetail(visitData.clientId))
            }}
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
        <FormattedMessage defaultMessage="Postup" id="visitDetail.procedure" />
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
                <FormattedMessage defaultMessage="+ Přidat proceduru" id="visitDetail.addProcedureButton" />
              </Button>
            }
          />
        )}
        {visitData.visitStatus && (
          <Typography color="info" fontWeight="600" align="center">
            <FormattedMessage
              defaultMessage=" Návštěva je uzavřená z bezpečnostních důvodů ji nelze editovat ani smazat. Můžete ji znovu otevřít v
            dokončení návštěvy."
              id="visitDetail.finishProcedureWarrning"
            />
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
