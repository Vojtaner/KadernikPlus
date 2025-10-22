import { Grid, Stack, Typography } from '@mui/material'
import DetailColumn from '../../../app/components/DetailColumn'
import Loader from '../../../components/Loader'
import { DepositStatus, type VisitWithServices } from '../entity'
import { formatNameShort } from '../../../entity'
import type { CreateProcedure, Procedure } from '../../../entities/procedure'
import { getDateTimeFromUtcToLocal } from './VisitsList'
import { useIntl, type IntlShape } from 'react-intl'

type VisitDetailGridProps = {
  visitData: VisitWithServices | undefined
}
const VisitDetailGrid = (props: VisitDetailGridProps) => {
  const { visitData } = props
  const intl = useIntl()

  if (!visitData) {
    return <Loader />
  }

  return (
    <Grid container rowSpacing={2}>
      <Grid size={4}>
        <DetailColumn
          label={intl.formatMessage({
            defaultMessage: 'Kadeřnice',
            id: 'visitDetailGrid.hairdresser',
          })}
          input={formatNameShort(`${visitData.user.name}`)}
        />
      </Grid>
      <Grid size={4}>
        <DetailColumn
          label={intl.formatMessage(
            {
              defaultMessage: 'status cena',
              id: 'visitDetailGrid.depositStatus',
            },
            { status: visitData.visitStatus ? 'Zaplacená' : 'Požadovaná' }
          )}
          input={formatToCZK(visitData.paidPrice)}
          helperText={formatToCZK(visitData.visitServices[0].service.basePrice)}
        />
      </Grid>
      <Grid size={4}>
        <DetailColumn
          label={intl.formatMessage({
            defaultMessage: 'Datum',
            id: 'visitDetailGrid.date',
          })}
          input={getDateTimeFromUtcToLocal(visitData.date)}
        />
      </Grid>
      {visitData.client.deposit ? (
        <>
          <Grid size={4}>
            <DetailColumn
              label={intl.formatMessage({
                defaultMessage: 'Stav zálohy',
                id: 'visitDetailGrid.depositState',
              })}
              input={
                <Typography textTransform="uppercase" fontSize="0.9rem" color="info.main" fontWeight={600}>
                  {visitData.depositStatus}
                </Typography>
              }
            />
          </Grid>
          <Grid size={4}>
            <DetailColumn
              label={intl.formatMessage({
                defaultMessage: 'Výše zálohy',
                id: 'visitDetailGrid.depositAmount',
              })}
              input={formatToCZK(visitData.deposit)}
            />
          </Grid>
        </>
      ) : (
        <Grid size={8} display="flex" alignItems="center">
          <Stack>
            <Typography variant="body1" fontSize="1.2rem" color="secondary.main" fontWeight="800">
              Klient neplatí zálohy.
            </Typography>
            <Typography variant="body2" color={'text.secondary'} fontSize="0.8rem">
              Změníte na klientově profilu
            </Typography>
          </Stack>
        </Grid>
      )}
      <Grid size={4} padding={0}>
        <DetailColumn
          label="Stav návštěvy"
          input={
            <Typography
              fontSize="0.9rem"
              textTransform="uppercase"
              color={visitData.visitStatus ? 'success.main' : 'error.main'}
              fontWeight={600}>
              {visitData.visitStatus ? 'Uzavřeno' : 'Neuzavřeno'}
            </Typography>
          }
        />
      </Grid>
    </Grid>
  )
}

export default VisitDetailGrid

export function formatToCZK(
  value: string | number | undefined,
  minimumFractionDigits?: number,
  maximumFractionDigits?: number
): string {
  if (!value) {
    return '0,00 Kč'
  }
  const numberValue = typeof value === 'string' ? parseFloat(value.replace(',', '.')) : value
  if (isNaN(numberValue)) {
    return ''
  }

  return numberValue.toLocaleString('cs-CZ', {
    style: 'currency',
    currency: 'CZK',
    minimumFractionDigits: minimumFractionDigits ?? 2,
    maximumFractionDigits: maximumFractionDigits ?? 2,
  })
}

export const getVisitFinishErrors = (
  clientDeposit: boolean,
  watchFormVisitData: {
    paidPrice: number | undefined
    deposit: number | undefined
    depositStatus: DepositStatus | null | undefined
  },
  intl: IntlShape
): string[] => {
  const { paidPrice, deposit, depositStatus } = watchFormVisitData
  const isDepositRequired = clientDeposit
  const errors: string[] = []

  if (!paidPrice || paidPrice <= 0) {
    errors.push(
      intl.formatMessage({
        defaultMessage: 'Je nutné zadat zaplacenou částku. "Požadovaná cena"',
        id: 'visitDetailGrid.paidPriceWarning',
      })
    )
  }

  if (isDepositRequired) {
    if (!deposit || deposit <= 0) {
      errors.push(
        intl.formatMessage({
          defaultMessage:
            'Je nutné zadat zálohu,případně v profilu zákazníka zaškrnout, že ji nepožadujete. "Výše zálohy"',
          id: 'visitDetailGrid.depositStatusWarning',
        })
      )
    }
    if (depositStatus !== DepositStatus.ZAPLACENO) {
      errors.push(
        intl.formatMessage({
          defaultMessage: 'Záloha musí být ve stavu zaplacena. "Stav zálohy"',
          id: 'visitDetailGrid.depositWarning',
        })
      )
    }
  }

  return errors
}

export const hasAnyStockAllowance = (procedures?: (Procedure | CreateProcedure)[]): boolean => {
  if (!procedures || procedures.length === 0) {
    return false
  }

  return procedures.some((p) => p.stockAllowances && p.stockAllowances.length > 0)
}

export const getMissingStockAllowanceError = (
  intl: IntlShape,
  procedures?: (Procedure | CreateProcedure)[]
): string | undefined => {
  if (!hasAnyStockAllowance(procedures)) {
    return intl.formatMessage({
      defaultMessage: 'Musí být spotřebován alespoň jeden materiál, bez toho neuvidíte náklady. (nepovinné)',
      id: 'visitDetailGrid.stockAllowanceWarning',
    })
  }
}

export const isVisitFinished = (
  clientDeposit: boolean,
  watchFormVisitData: {
    paidPrice: number | undefined
    deposit: number | undefined
    depositStatus: DepositStatus | null | undefined
    procedures: undefined | Procedure[]
  },
  intl: IntlShape
): boolean => {
  return getVisitFinishErrors(clientDeposit, watchFormVisitData, intl).length === 0
}
