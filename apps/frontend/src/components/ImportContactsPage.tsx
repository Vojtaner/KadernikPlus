import { Button, Stack, Typography } from '@mui/material'
import PricingCard from '../app/components/PricingCard'
import { useAuth0 } from '@auth0/auth0-react'
import AppTheme from '../AppTheme'
import LogoutIcon from '@mui/icons-material/Logout'
import { FormattedMessage, useIntl } from 'react-intl'
import { useImportPaymentMutation } from '../queries'

const ImportContactsPage = () => {
  const { user, logout } = useAuth0()
  const { mutate: purchaseImport } = useImportPaymentMutation()

  const intl = useIntl()

  const handlePurchase = () => {
    purchaseImport({ currency: 'CZK', price: 99900 })
  }

  return (
    <Stack spacing={2} alignItems="center" justifyContent="center" minHeight="85vh" width="100%">
      <Typography variant="h4" fontWeight="bold" align="center">
        <FormattedMessage id="importPage.welcome" defaultMessage="Ušetřete si čas při startu aplikace" />
      </Typography>
      <Typography variant="h4" fontWeight="bold" color="primary">
        <FormattedMessage id="importPage.headline" defaultMessage="Import kontaktů" />
      </Typography>
      <Typography variant="body1" color="text.secondary" textAlign="center" maxWidth={500} width="95vw">
        <strong style={{ color: AppTheme.palette.primary.main }}>
          {user
            ? `${intl.formatMessage({
                id: 'importPage.greeting',
                defaultMessage: 'Dobrý den,',
              })} ${user.name || ''} `
            : ''}
        </strong>
        {intl.formatMessage({
          id: 'importPage.introduction.1',
          defaultMessage: ' namísto ručního zadávání stovek záznamů si můžete jednorázově dokoupit funkci importu.',
        })}
      </Typography>

      <Button variant="contained" onClick={() => logout()} startIcon={<LogoutIcon />}>
        {intl.formatMessage({ id: 'logOut', defaultMessage: 'Odhlásit se' })}
      </Button>
      <PricingCard
        title={intl.formatMessage({ id: 'pricingCard.title', defaultMessage: 'Cena' })}
        price="Kč 999"
        period={intl.formatMessage({ id: 'pricingCard.period', defaultMessage: '/jednorázově' })}
        description={intl.formatMessage({
          id: 'pricingCard.description',
          defaultMessage: 'Proč se vyplatí připlatit:',
        })}
        features={[
          intl.formatMessage({ id: 'pricingCard.feature1', defaultMessage: 'Ušetřte hodiny ručního zadávání' }),
          intl.formatMessage({ id: 'pricingCard.feature2', defaultMessage: '800 kontaktů naimportujete během chvíle' }),
          intl.formatMessage({ id: 'pricingCard.feature3', defaultMessage: 'Bez chybného a nudného opisování' }),
          intl.formatMessage({
            id: 'pricingCard.feature4',
            defaultMessage: 'Kontakt ručně trvá až 1–2 min, kolik ušetříte?',
          }),
        ]}
        ctaText={intl.formatMessage({ id: 'pricingCard.ctaText', defaultMessage: 'Koupit import' })}
        onClick={handlePurchase}
        active
      />
    </Stack>
  )
}

export default ImportContactsPage
